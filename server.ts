import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getDb, saveDb } from './server/db.js';
import { storage } from './server/storage.js';
import { hashPassword, comparePassword, generateToken, requireAdmin, AuthRequest } from './server/auth.js';

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB per file for web demo

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON body parser with increased limit for base64 file payloads
  app.use(express.json({ limit: '60mb' }));
  app.use(express.urlencoded({ extended: true, limit: '60mb' }));

  // Initialize SQLite database
  const db = await getDb();

  // ----------------------------------------------------
  // API Routes
  // ----------------------------------------------------

  // Health Check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      clinic: 'Kiva Physiotherapy Clinic',
      service: 'Online Physiotherapy Consultation',
      timestamp: new Date().toISOString()
    });
  });

  // Admin Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        res.status(400).json({ error: 'Username and password are required' });
        return;
      }

      const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
      stmt.bind([username.trim()]);
      const hasRow = stmt.step();
      if (!hasRow) {
        stmt.free();
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const userRow = stmt.getAsObject() as {
        id: number;
        username: string;
        password_hash: string;
        role: string;
        full_name: string;
      };
      stmt.free();

      const isMatch = comparePassword(password, userRow.password_hash);
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const token = generateToken({
        userId: userRow.id,
        username: userRow.username,
        role: userRow.role,
      });

      res.json({
        token,
        user: {
          id: userRow.id,
          username: userRow.username,
          role: userRow.role,
          fullName: userRow.full_name,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error during login' });
    }
  });

  // Verify Admin Token
  app.get('/api/auth/me', requireAdmin, (req: AuthRequest, res: Response) => {
    res.json({ user: req.user });
  });

  // Public: Create Appointment Request
  app.post('/api/appointments', async (req: Request, res: Response) => {
    try {
      const { patient, health, schedule, payment, files } = req.body;

      // Validate patient details
      if (!patient?.fullName?.trim()) {
        res.status(400).json({ error: 'Full Name is required' });
        return;
      }
      if (!patient?.age || Number(patient.age) <= 0) {
        res.status(400).json({ error: 'Valid Age is required' });
        return;
      }
      if (!patient?.gender) {
        res.status(400).json({ error: 'Gender is required' });
        return;
      }
      if (!patient?.phone?.trim()) {
        res.status(400).json({ error: 'WhatsApp / Phone Number is required' });
        return;
      }
      if (!patient?.email?.trim()) {
        res.status(400).json({ error: 'Email address is required' });
        return;
      }

      // Validate health information
      if (!health?.problemDescription?.trim()) {
        res.status(400).json({ error: 'Problem description is required' });
        return;
      }
      if (!health?.problemDuration?.trim()) {
        res.status(400).json({ error: 'Problem duration is required' });
        return;
      }
      if (health.painLevel === undefined || health.painLevel === null || health.painLevel < 0 || health.painLevel > 10) {
        res.status(400).json({ error: 'Pain level between 0 and 10 is required' });
        return;
      }

      // Validate schedule
      const preferredTime = schedule?.preferredTime || 'Morning';
      if (!['Morning', 'Afternoon', 'Evening'].includes(preferredTime)) {
        res.status(400).json({ error: 'Invalid preferred consultation time' });
        return;
      }

      // Validate payment acknowledgement
      if (!payment?.confirmedCorrect) {
        res.status(400).json({ error: 'Please confirm that the information provided is correct' });
        return;
      }

      // Generate Unique Appointment ID
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const year = new Date().getFullYear();
      const appointmentId = `KIVA-${year}-${randomSuffix}`;
      const nowIso = new Date().toISOString();

      // 1. Insert patient
      db.run(
        `INSERT INTO patient_information (full_name, age, gender, phone, email, city_country, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          patient.fullName.trim(),
          Number(patient.age),
          patient.gender,
          patient.phone.trim(),
          patient.email.trim(),
          patient.cityCountry?.trim() || 'Not specified',
          nowIso
        ]
      );

      const patientIdRes = db.exec('SELECT last_insert_rowid() as id');
      const patientId = patientIdRes[0].values[0][0] as number;

      // 2. Insert appointment
      const hasReports = Boolean(health.hasMedicalReports);
      db.run(
        `INSERT INTO appointments (id, patient_id, problem_description, problem_duration, pain_level, has_medical_reports, preferred_time, status, is_demo, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'PAYMENT VERIFICATION', 0, ?, ?)`,
        [
          appointmentId,
          patientId,
          health.problemDescription.trim(),
          health.problemDuration.trim(),
          Number(health.painLevel),
          hasReports ? 1 : 0,
          preferredTime,
          nowIso,
          nowIso
        ]
      );

      // 3. Process Medical Reports
      if (files?.medicalReports && Array.isArray(files.medicalReports)) {
        const reportsToProcess = files.medicalReports.slice(0, 5);
        for (const report of reportsToProcess) {
          if (!report.base64 || !report.name) continue;
          const mime = report.mimeType || 'application/octet-stream';
          if (!ALLOWED_MIME_TYPES.includes(mime)) {
            continue; // Skip unsupported format
          }

          const base64Data = report.base64.replace(/^data:[^;]+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');

          if (buffer.length > MAX_FILE_SIZE) {
            continue;
          }

          const stored = await storage.saveFile(buffer, report.name, mime);
          db.run(
            `INSERT INTO medical_reports (appointment_id, file_id, original_name, mime_type, file_size, created_at)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [appointmentId, stored.fileId, stored.originalName, stored.mimeType, stored.size, nowIso]
          );
        }
      }

      // 4. Process Payment Screenshot
      let screenshotFileId = null;
      let screenshotName = null;
      let screenshotMime = null;
      let screenshotSize = null;

      if (files?.paymentScreenshot?.base64) {
        const pshot = files.paymentScreenshot;
        const mime = pshot.mimeType || 'image/jpeg';
        if (ALLOWED_MIME_TYPES.includes(mime)) {
          const base64Data = pshot.base64.replace(/^data:[^;]+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          if (buffer.length <= MAX_FILE_SIZE) {
            const stored = await storage.saveFile(buffer, pshot.name || 'payment_proof.jpg', mime);
            screenshotFileId = stored.fileId;
            screenshotName = stored.originalName;
            screenshotMime = stored.mimeType;
            screenshotSize = stored.size;
          }
        }
      }

      // 5. Insert Payment
      db.run(
        `INSERT INTO payments (appointment_id, amount, currency, method, payment_number, screenshot_file_id, screenshot_original_name, screenshot_mime_type, screenshot_size, status, created_at)
         VALUES (?, 500, 'INR', ?, '9875138912', ?, ?, ?, ?, 'PENDING_VERIFICATION', ?)`,
        [
          appointmentId,
          payment?.method || 'UPI (PhonePe/Paytm/GPay)',
          screenshotFileId,
          screenshotName,
          screenshotMime,
          screenshotSize,
          nowIso
        ]
      );

      // 6. Insert initial status log
      db.run(
        `INSERT INTO appointment_status (appointment_id, status, changed_by, notes, created_at)
         VALUES (?, 'PAYMENT VERIFICATION', 'Patient (Online Submission)', 'Appointment requested with payment proof uploaded.', ?)`,
        [appointmentId, nowIso]
      );

      saveDb(db);

      res.status(201).json({
        success: true,
        appointmentId,
        patientName: patient.fullName,
        preferredTime,
        paymentStatus: 'PENDING_VERIFICATION',
        status: 'PAYMENT VERIFICATION',
        consultationFee: 500,
        createdAt: nowIso,
      });
    } catch (error) {
      console.error('Create appointment error:', error);
      res.status(500).json({ error: 'Failed to process appointment request' });
    }
  });

  // Public: Check Patient Booking Status (Minimal, Privacy-Preserving)
  app.get('/api/appointments/status', (req: Request, res: Response) => {
    try {
      const { appointmentId, identifier } = req.query;

      if (!appointmentId || !identifier) {
        res.status(400).json({ error: 'Appointment ID and Phone/Email are required' });
        return;
      }

      const cleanApptId = String(appointmentId).trim().toUpperCase();
      const cleanIdent = String(identifier).trim().toLowerCase();

      const stmt = db.prepare(`
        SELECT
          a.id,
          a.status,
          a.preferred_time,
          a.confirmed_date,
          a.confirmed_time,
          a.video_link,
          a.created_at,
          p.full_name,
          p.phone,
          p.email,
          pay.status as payment_status
        FROM appointments a
        JOIN patient_information p ON a.patient_id = p.id
        LEFT JOIN payments pay ON pay.appointment_id = a.id
        WHERE UPPER(a.id) = ?
      `);

      stmt.bind([cleanApptId]);
      const hasRow = stmt.step();
      if (!hasRow) {
        stmt.free();
        res.status(404).json({ error: 'No appointment found with the provided details' });
        return;
      }

      const row = stmt.getAsObject() as {
        id: string;
        status: string;
        preferred_time: string;
        confirmed_date: string | null;
        confirmed_time: string | null;
        video_link: string | null;
        created_at: string;
        full_name: string;
        phone: string;
        email: string;
        payment_status: string | null;
      };
      stmt.free();

      // Verify identifier matches phone or email
      const phoneDigits = row.phone.replace(/\D/g, '');
      const inputDigits = cleanIdent.replace(/\D/g, '');
      const phoneMatches = inputDigits.length >= 6 && phoneDigits.includes(inputDigits);
      const emailMatches = row.email.toLowerCase() === cleanIdent;

      if (!phoneMatches && !emailMatches) {
        res.status(404).json({ error: 'No matching appointment found for this phone/email' });
        return;
      }

      // Privacy: Mask patient name (e.g. "Rohan Verma" -> "R**** V****")
      const nameParts = row.full_name.trim().split(/\s+/);
      const maskedName = nameParts
        .map(part => part.charAt(0) + '*'.repeat(Math.max(part.length - 1, 2)))
        .join(' ');

      res.json({
        appointmentId: row.id,
        patientNameMasked: maskedName,
        requestReceivedAt: row.created_at,
        preferredTime: row.preferred_time,
        paymentStatus: row.payment_status || 'PENDING_VERIFICATION',
        appointmentStatus: row.status,
        confirmedDate: row.confirmed_date || null,
        confirmedTime: row.confirmed_time || null,
        videoLink: row.status === 'CONFIRMED' ? row.video_link : null,
      });
    } catch (error) {
      console.error('Status check error:', error);
      res.status(500).json({ error: 'Error checking appointment status' });
    }
  });

  // Admin: List all appointments
  app.get('/api/admin/appointments', requireAdmin, (_req: AuthRequest, res: Response) => {
    try {
      const stmt = db.prepare(`
        SELECT
          a.id,
          a.status,
          a.pain_level,
          a.preferred_time,
          a.confirmed_date,
          a.confirmed_time,
          a.video_link,
          a.is_demo,
          a.created_at,
          a.updated_at,
          p.full_name,
          p.phone,
          p.email,
          p.age,
          p.gender,
          p.city_country,
          pay.status as payment_status,
          pay.method as payment_method,
          (SELECT COUNT(*) FROM medical_reports mr WHERE mr.appointment_id = a.id) as reports_count,
          (SELECT COUNT(*) FROM admin_notes an WHERE an.appointment_id = a.id) as notes_count
        FROM appointments a
        JOIN patient_information p ON a.patient_id = p.id
        LEFT JOIN payments pay ON pay.appointment_id = a.id
        ORDER BY a.created_at DESC
      `);

      const appointments = [];
      while (stmt.step()) {
        appointments.push(stmt.getAsObject());
      }
      stmt.free();

      res.json({ appointments });
    } catch (error) {
      console.error('Admin appointments error:', error);
      res.status(500).json({ error: 'Failed to load appointments' });
    }
  });

  // Admin: Get single appointment details
  app.get('/api/admin/appointments/:id', requireAdmin, (req: AuthRequest, res: Response) => {
    try {
      const appointmentId = req.params.id;

      // 1. Appointment & Patient
      const stmt = db.prepare(`
        SELECT
          a.*,
          p.full_name,
          p.age,
          p.gender,
          p.phone,
          p.email,
          p.city_country
        FROM appointments a
        JOIN patient_information p ON a.patient_id = p.id
        WHERE a.id = ?
      `);
      stmt.bind([appointmentId]);
      if (!stmt.step()) {
        stmt.free();
        res.status(404).json({ error: 'Appointment not found' });
        return;
      }
      const appointment = stmt.getAsObject();
      stmt.free();

      // 2. Medical Reports
      const repStmt = db.prepare(`
        SELECT id, file_id, original_name, mime_type, file_size, created_at
        FROM medical_reports
        WHERE appointment_id = ?
      `);
      repStmt.bind([appointmentId]);
      const medicalReports = [];
      while (repStmt.step()) {
        medicalReports.push(repStmt.getAsObject());
      }
      repStmt.free();

      // 3. Payment details
      const payStmt = db.prepare(`
        SELECT id, amount, currency, method, payment_number, screenshot_file_id, screenshot_original_name, screenshot_size, status, created_at
        FROM payments
        WHERE appointment_id = ?
      `);
      payStmt.bind([appointmentId]);
      let payment = null;
      if (payStmt.step()) {
        payment = payStmt.getAsObject();
      }
      payStmt.free();

      // 4. Status History
      const histStmt = db.prepare(`
        SELECT id, status, changed_by, notes, created_at
        FROM appointment_status
        WHERE appointment_id = ?
        ORDER BY created_at DESC
      `);
      histStmt.bind([appointmentId]);
      const statusHistory = [];
      while (histStmt.step()) {
        statusHistory.push(histStmt.getAsObject());
      }
      histStmt.free();

      // 5. Admin Notes
      const noteStmt = db.prepare(`
        SELECT id, author, note_text, created_at
        FROM admin_notes
        WHERE appointment_id = ?
        ORDER BY created_at DESC
      `);
      noteStmt.bind([appointmentId]);
      const notes = [];
      while (noteStmt.step()) {
        notes.push(noteStmt.getAsObject());
      }
      noteStmt.free();

      res.json({
        appointment,
        medicalReports,
        payment,
        statusHistory,
        notes,
      });
    } catch (error) {
      console.error('Admin appointment detail error:', error);
      res.status(500).json({ error: 'Failed to retrieve appointment details' });
    }
  });

  // Admin: Update Appointment Status / Schedule
  app.patch('/api/admin/appointments/:id', requireAdmin, (req: AuthRequest, res: Response) => {
    try {
      const appointmentId = req.params.id;
      const { status, confirmedDate, confirmedTime, videoLink, paymentStatus, note } = req.body;

      const validStatuses = ['NEW', 'PAYMENT VERIFICATION', 'CONFIRMED', 'RESCHEDULED', 'COMPLETED', 'CANCELLED'];
      if (status && !validStatuses.includes(status)) {
        res.status(400).json({ error: 'Invalid status' });
        return;
      }

      const nowIso = new Date().toISOString();

      // Update appointment
      db.run(
        `UPDATE appointments
         SET status = COALESCE(?, status),
             confirmed_date = COALESCE(?, confirmed_date),
             confirmed_time = COALESCE(?, confirmed_time),
             video_link = COALESCE(?, video_link),
             updated_at = ?
         WHERE id = ?`,
        [status || null, confirmedDate || null, confirmedTime || null, videoLink || null, nowIso, appointmentId]
      );

      // Update payment status if provided
      if (paymentStatus) {
        db.run(
          `UPDATE payments SET status = ? WHERE appointment_id = ?`,
          [paymentStatus, appointmentId]
        );
      }

      // Record status change log
      if (status) {
        db.run(
          `INSERT INTO appointment_status (appointment_id, status, changed_by, notes, created_at)
           VALUES (?, ?, ?, ?, ?)`,
          [appointmentId, status, req.user?.username || 'Admin', note || `Status changed to ${status}`, nowIso]
        );
      }

      saveDb(db);
      res.json({ success: true, message: 'Appointment updated successfully' });
    } catch (error) {
      console.error('Admin update error:', error);
      res.status(500).json({ error: 'Failed to update appointment' });
    }
  });

  // Admin: Add Note
  app.post('/api/admin/appointments/:id/notes', requireAdmin, (req: AuthRequest, res: Response) => {
    try {
      const appointmentId = req.params.id;
      const { noteText } = req.body;

      if (!noteText?.trim()) {
        res.status(400).json({ error: 'Note text cannot be empty' });
        return;
      }

      const nowIso = new Date().toISOString();
      db.run(
        `INSERT INTO admin_notes (appointment_id, author, note_text, created_at)
         VALUES (?, ?, ?, ?)`,
        [appointmentId, req.user?.username || 'Admin', noteText.trim(), nowIso]
      );

      saveDb(db);
      res.status(201).json({ success: true, message: 'Note added' });
    } catch (error) {
      console.error('Add note error:', error);
      res.status(500).json({ error: 'Failed to add note' });
    }
  });

  // Public: Serve approved media files (photos in reviews/gallery)
  app.get('/api/media/:fileId', async (req: Request, res: Response) => {
    try {
      const fileId = req.params.fileId;
      const fileResult = await storage.getFile(fileId);
      if (!fileResult) {
        res.status(404).json({ error: 'Media not found' });
        return;
      }
      const { buffer, meta } = fileResult;
      // Safety: only serve image formats
      if (!meta.mimeType.startsWith('image/')) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }
      res.setHeader('Content-Type', meta.mimeType);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.send(buffer);
    } catch (error) {
      console.error('Media serve error:', error);
      res.status(500).json({ error: 'Error loading media' });
    }
  });

  // Public: Get aggregated content (settings, services, featured gallery, featured reviews, FAQs)
  app.get('/api/public/content', (_req: Request, res: Response) => {
    try {
      // 1. Settings
      const setStmt = db.prepare('SELECT key, value FROM clinic_settings');
      const settings: Record<string, string> = {};
      while (setStmt.step()) {
        const row = setStmt.getAsObject() as { key: string; value: string };
        settings[row.key] = row.value;
      }
      setStmt.free();

      // 2. Services (active)
      const servStmt = db.prepare(`
        SELECT id, name, short_description, full_description, icon_name, image_url, display_order
        FROM services
        WHERE is_active = 1
        ORDER BY display_order ASC, id ASC
      `);
      const services = [];
      while (servStmt.step()) {
        services.push(servStmt.getAsObject());
      }
      servStmt.free();

      // 3. Featured Gallery Images (published)
      const galStmt = db.prepare(`
        SELECT id, title, description, category, image_url, is_featured, is_demo
        FROM gallery_images
        WHERE is_published = 1
        ORDER BY is_featured DESC, display_order ASC, id DESC
        LIMIT 6
      `);
      const featuredGallery = [];
      while (galStmt.step()) {
        featuredGallery.push(galStmt.getAsObject());
      }
      galStmt.free();

      // 4. Approved Featured Reviews
      const revStmt = db.prepare(`
        SELECT id, patient_name, city, rating, review_text, photo_url, is_featured, is_demo, created_at
        FROM reviews
        WHERE status = 'APPROVED'
        ORDER BY is_featured DESC, created_at DESC
        LIMIT 6
      `);
      const featuredReviews = [];
      while (revStmt.step()) {
        featuredReviews.push(revStmt.getAsObject());
      }
      revStmt.free();

      // 5. FAQs
      const faqStmt = db.prepare(`
        SELECT id, question, answer, category, display_order
        FROM faqs
        WHERE is_active = 1
        ORDER BY display_order ASC, id ASC
      `);
      const faqs = [];
      while (faqStmt.step()) {
        faqs.push(faqStmt.getAsObject());
      }
      faqStmt.free();

      res.json({
        settings,
        services,
        featuredGallery,
        featuredReviews,
        faqs,
      });
    } catch (error) {
      console.error('Public content error:', error);
      res.status(500).json({ error: 'Failed to load clinic content' });
    }
  });

  // Public: All published gallery images with category filtering
  app.get('/api/gallery', (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      let query = `
        SELECT id, title, description, category, image_url, is_featured, is_demo, created_at
        FROM gallery_images
        WHERE is_published = 1
      `;
      const params: any[] = [];
      if (category && category !== 'All') {
        query += ' AND category = ?';
        params.push(category);
      }
      query += ' ORDER BY display_order ASC, id DESC';

      const stmt = db.prepare(query);
      if (params.length > 0) stmt.bind(params);
      const images = [];
      while (stmt.step()) {
        images.push(stmt.getAsObject());
      }
      stmt.free();

      res.json({ images });
    } catch (error) {
      console.error('Gallery error:', error);
      res.status(500).json({ error: 'Failed to load gallery' });
    }
  });

  // Public: All approved reviews
  app.get('/api/reviews', (_req: Request, res: Response) => {
    try {
      const stmt = db.prepare(`
        SELECT id, patient_name, city, age, rating, review_text, photo_url, is_featured, is_demo, created_at
        FROM reviews
        WHERE UPPER(status) = 'APPROVED'
        ORDER BY is_featured DESC, created_at DESC
      `);
      const reviews = [];
      while (stmt.step()) {
        reviews.push(stmt.getAsObject());
      }
      stmt.free();
      res.json({ reviews });
    } catch (error) {
      console.error('Reviews error:', error);
      res.status(500).json({ error: 'Failed to load reviews' });
    }
  });

  // Public: Submit Patient Review / Story (Always stored with 'pending' status)
  app.post('/api/reviews/submit', async (req: Request, res: Response) => {
    try {
      const {
        patientName,
        name,
        patient_name,
        city,
        age,
        rating,
        reviewText,
        review,
        text,
        review_text,
        photoBase64,
        photoUrl: inputPhotoUrl,
        photoName,
        consent,
      } = req.body;

      const finalName = (patientName || patient_name || name || '').trim();
      const finalReview = (reviewText || review_text || review || text || '').trim();
      const finalCity = (city || '').trim();

      if (!finalName) {
        res.status(400).json({ error: 'Patient name is required' });
        return;
      }
      if (!finalReview) {
        res.status(400).json({ error: 'Review text is required' });
        return;
      }

      let photoUrl = inputPhotoUrl?.trim() || '';
      if (photoBase64 && photoBase64.startsWith('data:image/')) {
        const matches = photoBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, 'base64');
          if (buffer.length <= 10 * 1024 * 1024) {
            const stored = await storage.saveFile(buffer, photoName || 'patient_story.jpg', mimeType);
            photoUrl = `/api/media/${stored.fileId}`;
          }
        }
      }

      const nowIso = new Date().toISOString();
      const numRating = rating ? Math.min(Math.max(Number(rating), 1), 5) : 5;
      const numAge = age ? Number(age) : null;

      // Stored with 'pending' status in the database, requiring admin approval before appearing publicly
      db.run(
        `INSERT INTO reviews (patient_name, city, age, rating, review_text, photo_url, status, is_featured, has_consent, is_demo, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 'pending', 0, 1, 0, ?)`,
        [finalName, finalCity || null, numAge, numRating, finalReview, photoUrl || null, nowIso]
      );
      saveDb(db);

      res.status(201).json({
        success: true,
        status: 'pending',
        message: 'Thank you for sharing your feedback! Your review has been submitted with status "pending" and will appear on the website once approved by our clinic administrator.'
      });
    } catch (error) {
      console.error('Submit review error:', error);
      res.status(500).json({ error: 'Failed to submit review' });
    }
  });

  // Public: All active services
  app.get('/api/services', (_req: Request, res: Response) => {
    try {
      const stmt = db.prepare(`
        SELECT id, name, short_description, full_description, icon_name, image_url, display_order
        FROM services
        WHERE is_active = 1
        ORDER BY display_order ASC, id ASC
      `);
      const services = [];
      while (stmt.step()) {
        services.push(stmt.getAsObject());
      }
      stmt.free();
      res.json({ services });
    } catch (error) {
      console.error('Services error:', error);
      res.status(500).json({ error: 'Failed to load services' });
    }
  });

  // Public: All active FAQs
  app.get('/api/faqs', (_req: Request, res: Response) => {
    try {
      const stmt = db.prepare(`
        SELECT id, question, answer, category, display_order
        FROM faqs
        WHERE is_active = 1
        ORDER BY display_order ASC, id ASC
      `);
      const faqs = [];
      while (stmt.step()) {
        faqs.push(stmt.getAsObject());
      }
      stmt.free();
      res.json({ faqs });
    } catch (error) {
      console.error('FAQs error:', error);
      res.status(500).json({ error: 'Failed to load FAQs' });
    }
  });

  // ----------------------------------------------------
  // Admin CMS & Management Endpoints
  // ----------------------------------------------------

  // Admin Overview Metrics
  app.get('/api/admin/overview', requireAdmin, (_req: AuthRequest, res: Response) => {
    try {
      const totalApptsRes = db.exec('SELECT COUNT(*) FROM appointments');
      const totalAppts = totalApptsRes[0]?.values[0][0] as number || 0;

      const newRequestsRes = db.exec("SELECT COUNT(*) FROM appointments WHERE status = 'NEW'");
      const newRequests = newRequestsRes[0]?.values[0][0] as number || 0;

      const pendingPayRes = db.exec("SELECT COUNT(*) FROM appointments WHERE status = 'PAYMENT VERIFICATION'");
      const pendingPayments = pendingPayRes[0]?.values[0][0] as number || 0;

      const confirmedRes = db.exec("SELECT COUNT(*) FROM appointments WHERE status = 'CONFIRMED'");
      const confirmedAppointments = confirmedRes[0]?.values[0][0] as number || 0;

      const pendingReviewsRes = db.exec("SELECT COUNT(*) FROM reviews WHERE LOWER(status) = 'pending' OR status = 'PENDING_APPROVAL'");
      const pendingReviews = pendingReviewsRes[0]?.values[0][0] as number || 0;

      const pendingPhotosRes = db.exec("SELECT COUNT(*) FROM reviews WHERE (LOWER(status) = 'pending' OR status = 'PENDING_APPROVAL') AND photo_url IS NOT NULL AND photo_url != ''");
      const pendingPhotos = pendingPhotosRes[0]?.values[0][0] as number || 0;

      const today = new Date().toISOString().slice(0, 10);
      const todayApptsRes = db.exec(`SELECT COUNT(*) FROM appointments WHERE created_at LIKE '${today}%' OR confirmed_date = '${today}'`);
      const appointmentsToday = todayApptsRes[0]?.values[0][0] as number || 0;

      res.json({
        appointmentsToday,
        newRequests,
        pendingPayments,
        confirmedAppointments,
        pendingReviews,
        pendingPhotos,
        totalAppointments: totalAppts,
      });
    } catch (error) {
      console.error('Overview metrics error:', error);
      res.status(500).json({ error: 'Failed to retrieve overview metrics' });
    }
  });

  // Admin Settings: Get & Update
  app.get('/api/admin/settings', requireAdmin, (_req: AuthRequest, res: Response) => {
    try {
      const stmt = db.prepare('SELECT key, value FROM clinic_settings');
      const settings: Record<string, string> = {};
      while (stmt.step()) {
        const row = stmt.getAsObject() as { key: string; value: string };
        settings[row.key] = row.value;
      }
      stmt.free();
      res.json({ settings });
    } catch (error) {
      console.error('Admin settings error:', error);
      res.status(500).json({ error: 'Failed to load settings' });
    }
  });

  app.put('/api/admin/settings', requireAdmin, (req: AuthRequest, res: Response) => {
    try {
      const { settings } = req.body;
      if (!settings || typeof settings !== 'object') {
        res.status(400).json({ error: 'Settings object is required' });
        return;
      }
      for (const [key, value] of Object.entries(settings)) {
        db.run('INSERT OR REPLACE INTO clinic_settings (key, value) VALUES (?, ?)', [key, String(value ?? '')]);
      }
      saveDb(db);
      res.json({ success: true, message: 'Settings saved and published successfully' });
    } catch (error) {
      console.error('Save settings error:', error);
      res.status(500).json({ error: 'Failed to save settings' });
    }
  });

  // Admin Services: CRUD
  app.get('/api/admin/services', requireAdmin, (_req: AuthRequest, res: Response) => {
    try {
      const stmt = db.prepare('SELECT * FROM services ORDER BY display_order ASC, id ASC');
      const services = [];
      while (stmt.step()) {
        services.push(stmt.getAsObject());
      }
      stmt.free();
      res.json({ services });
    } catch (error) {
      console.error('Admin services error:', error);
      res.status(500).json({ error: 'Failed to load services' });
    }
  });

  app.post('/api/admin/services', requireAdmin, (req: AuthRequest, res: Response) => {
    try {
      const { name, short_description, full_description, icon_name, image_url, display_order, is_active } = req.body;
      if (!name?.trim()) {
        res.status(400).json({ error: 'Service name is required' });
        return;
      }
      db.run(
        `INSERT INTO services (name, short_description, full_description, icon_name, image_url, display_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          name.trim(),
          short_description?.trim() || '',
          full_description?.trim() || '',
          icon_name?.trim() || 'Activity',
          image_url?.trim() || '',
          Number(display_order) || 0,
          is_active !== undefined ? (is_active ? 1 : 0) : 1,
        ]
      );
      saveDb(db);
      res.status(201).json({ success: true, message: 'Service created successfully' });
    } catch (error) {
      console.error('Create service error:', error);
      res.status(500).json({ error: 'Failed to create service' });
    }
  });

  app.put('/api/admin/services/:id', requireAdmin, (req: AuthRequest, res: Response) => {
    try {
      const id = req.params.id;
      const { name, short_description, full_description, icon_name, image_url, display_order, is_active } = req.body;
      db.run(
        `UPDATE services
         SET name = ?, short_description = ?, full_description = ?, icon_name = ?, image_url = ?, display_order = ?, is_active = ?
         WHERE id = ?`,
        [
          name?.trim(),
          short_description?.trim() || '',
          full_description?.trim() || '',
          icon_name?.trim() || 'Activity',
          image_url?.trim() || '',
          Number(display_order) || 0,
          is_active ? 1 : 0,
          id,
        ]
      );
      saveDb(db);
      res.json({ success: true, message: 'Service updated' });
    } catch (error) {
      console.error('Update service error:', error);
      res.status(500).json({ error: 'Failed to update service' });
    }
  });

  app.delete('/api/admin/services/:id', requireAdmin, (req: AuthRequest, res: Response) => {
    try {
      db.run('DELETE FROM services WHERE id = ?', [req.params.id]);
      saveDb(db);
      res.json({ success: true, message: 'Service deleted' });
    } catch (error) {
      console.error('Delete service error:', error);
      res.status(500).json({ error: 'Failed to delete service' });
    }
  });

  // Admin Gallery: CRUD & Upload
  app.get('/api/admin/gallery', requireAdmin, (_req: AuthRequest, res: Response) => {
    try {
      const stmt = db.prepare('SELECT * FROM gallery_images ORDER BY display_order ASC, id DESC');
      const images = [];
      while (stmt.step()) {
        images.push(stmt.getAsObject());
      }
      stmt.free();
      res.json({ images });
    } catch (error) {
      console.error('Admin gallery error:', error);
      res.status(500).json({ error: 'Failed to load gallery images' });
    }
  });

  app.post('/api/admin/gallery', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { title, description, category, imageUrl, imageBase64, imageName, display_order, is_featured, is_published } = req.body;
      if (!title?.trim()) {
        res.status(400).json({ error: 'Title is required' });
        return;
      }

      let finalImageUrl = imageUrl?.trim() || '';
      if (imageBase64 && imageBase64.startsWith('data:image/')) {
        const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, 'base64');
          const stored = await storage.saveFile(buffer, imageName || 'gallery.jpg', mimeType);
          finalImageUrl = `/api/media/${stored.fileId}`;
        }
      }

      if (!finalImageUrl) {
        res.status(400).json({ error: 'An image file or image URL is required' });
        return;
      }

      const nowIso = new Date().toISOString();
      db.run(
        `INSERT INTO gallery_images (title, description, category, image_url, display_order, is_featured, is_published, is_demo, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)`,
        [
          title.trim(),
          description?.trim() || '',
          category || 'Clinic',
          finalImageUrl,
          Number(display_order) || 0,
          is_featured ? 1 : 0,
          is_published !== undefined ? (is_published ? 1 : 0) : 1,
          nowIso,
        ]
      );
      saveDb(db);
      res.status(201).json({ success: true, message: 'Photo added to gallery' });
    } catch (error) {
      console.error('Add gallery photo error:', error);
      res.status(500).json({ error: 'Failed to add gallery photo' });
    }
  });

  app.put('/api/admin/gallery/:id', requireAdmin, (req: AuthRequest, res: Response) => {
    try {
      const id = req.params.id;
      const { title, description, category, imageUrl, display_order, is_featured, is_published } = req.body;
      db.run(
        `UPDATE gallery_images
         SET title = COALESCE(?, title),
             description = COALESCE(?, description),
             category = COALESCE(?, category),
             image_url = COALESCE(?, image_url),
             display_order = COALESCE(?, display_order),
             is_featured = COALESCE(?, is_featured),
             is_published = COALESCE(?, is_published)
         WHERE id = ?`,
        [
          title?.trim() ?? null,
          description?.trim() ?? null,
          category ?? null,
          imageUrl?.trim() ?? null,
          display_order !== undefined ? Number(display_order) : null,
          is_featured !== undefined ? (is_featured ? 1 : 0) : null,
          is_published !== undefined ? (is_published ? 1 : 0) : null,
          id,
        ]
      );
      saveDb(db);
      res.json({ success: true, message: 'Gallery item updated' });
    } catch (error) {
      console.error('Update gallery error:', error);
      res.status(500).json({ error: 'Failed to update gallery image' });
    }
  });

  app.delete('/api/admin/gallery/:id', requireAdmin, (req: AuthRequest, res: Response) => {
    try {
      db.run('DELETE FROM gallery_images WHERE id = ?', [req.params.id]);
      saveDb(db);
      res.json({ success: true, message: 'Gallery image deleted' });
    } catch (error) {
      console.error('Delete gallery image error:', error);
      res.status(500).json({ error: 'Failed to delete gallery image' });
    }
  });

  // Admin Reviews: CRUD & Moderation
  app.get('/api/admin/reviews', requireAdmin, (_req: AuthRequest, res: Response) => {
    try {
      const stmt = db.prepare('SELECT * FROM reviews ORDER BY created_at DESC');
      const reviews = [];
      while (stmt.step()) {
        reviews.push(stmt.getAsObject());
      }
      stmt.free();
      res.json({ reviews });
    } catch (error) {
      console.error('Admin reviews error:', error);
      res.status(500).json({ error: 'Failed to load reviews' });
    }
  });

  app.post('/api/admin/reviews', requireAdmin, (req: AuthRequest, res: Response) => {
    try {
      const { patient_name, city, age, rating, review_text, photo_url, status, is_featured } = req.body;
      if (!patient_name?.trim() || !review_text?.trim()) {
        res.status(400).json({ error: 'Patient name and review text are required' });
        return;
      }
      const nowIso = new Date().toISOString();
      db.run(
        `INSERT INTO reviews (patient_name, city, age, rating, review_text, photo_url, status, is_featured, has_consent, is_demo, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 0, ?)`,
        [
          patient_name.trim(),
          city?.trim() || null,
          age ? Number(age) : null,
          rating ? Number(rating) : null,
          review_text.trim(),
          photo_url?.trim() || null,
          status || 'APPROVED',
          is_featured ? 1 : 0,
          nowIso,
        ]
      );
      saveDb(db);
      res.status(201).json({ success: true, message: 'Review added successfully' });
    } catch (error) {
      console.error('Add review error:', error);
      res.status(500).json({ error: 'Failed to add review' });
    }
  });

  const handleAdminReviewUpdate = (req: AuthRequest, res: Response) => {
    try {
      const id = req.params.id;
      const { status, is_featured, patient_name, review_text, city, rating } = req.body;
      db.run(
        `UPDATE reviews
         SET status = COALESCE(?, status),
             is_featured = COALESCE(?, is_featured),
             patient_name = COALESCE(?, patient_name),
             review_text = COALESCE(?, review_text),
             city = COALESCE(?, city),
             rating = COALESCE(?, rating)
         WHERE id = ?`,
        [
          status ?? null,
          is_featured !== undefined ? (is_featured ? 1 : 0) : null,
          patient_name?.trim() ?? null,
          review_text?.trim() ?? null,
          city?.trim() ?? null,
          rating !== undefined ? Number(rating) : null,
          id,
        ]
      );
      saveDb(db);
      res.json({ success: true, message: 'Review updated' });
    } catch (error) {
      console.error('Update review error:', error);
      res.status(500).json({ error: 'Failed to update review' });
    }
  };

  app.put('/api/admin/reviews/:id', requireAdmin, handleAdminReviewUpdate);
  app.patch('/api/admin/reviews/:id', requireAdmin, handleAdminReviewUpdate);

  app.delete('/api/admin/reviews/:id', requireAdmin, (req: AuthRequest, res: Response) => {
    try {
      db.run('DELETE FROM reviews WHERE id = ?', [req.params.id]);
      saveDb(db);
      res.json({ success: true, message: 'Review deleted' });
    } catch (error) {
      console.error('Delete review error:', error);
      res.status(500).json({ error: 'Failed to delete review' });
    }
  });

  // Admin FAQs: CRUD
  app.get('/api/admin/faqs', requireAdmin, (_req: AuthRequest, res: Response) => {
    try {
      const stmt = db.prepare('SELECT * FROM faqs ORDER BY display_order ASC, id ASC');
      const faqs = [];
      while (stmt.step()) {
        faqs.push(stmt.getAsObject());
      }
      stmt.free();
      res.json({ faqs });
    } catch (error) {
      console.error('Admin faqs error:', error);
      res.status(500).json({ error: 'Failed to load faqs' });
    }
  });

  app.post('/api/admin/faqs', requireAdmin, (req: AuthRequest, res: Response) => {
    try {
      const { question, answer, category, display_order, is_active } = req.body;
      if (!question?.trim() || !answer?.trim()) {
        res.status(400).json({ error: 'Question and answer are required' });
        return;
      }
      db.run(
        `INSERT INTO faqs (question, answer, category, display_order, is_active)
         VALUES (?, ?, ?, ?, ?)`,
        [
          question.trim(),
          answer.trim(),
          category?.trim() || 'General',
          Number(display_order) || 0,
          is_active !== undefined ? (is_active ? 1 : 0) : 1,
        ]
      );
      saveDb(db);
      res.status(201).json({ success: true, message: 'FAQ created' });
    } catch (error) {
      console.error('Create FAQ error:', error);
      res.status(500).json({ error: 'Failed to create FAQ' });
    }
  });

  app.put('/api/admin/faqs/:id', requireAdmin, (req: AuthRequest, res: Response) => {
    try {
      const id = req.params.id;
      const { question, answer, category, display_order, is_active } = req.body;
      db.run(
        `UPDATE faqs
         SET question = ?, answer = ?, category = ?, display_order = ?, is_active = ?
         WHERE id = ?`,
        [
          question?.trim(),
          answer?.trim(),
          category?.trim() || 'General',
          Number(display_order) || 0,
          is_active ? 1 : 0,
          id,
        ]
      );
      saveDb(db);
      res.json({ success: true, message: 'FAQ updated' });
    } catch (error) {
      console.error('Update FAQ error:', error);
      res.status(500).json({ error: 'Failed to update FAQ' });
    }
  });

  app.delete('/api/admin/faqs/:id', requireAdmin, (req: AuthRequest, res: Response) => {
    try {
      db.run('DELETE FROM faqs WHERE id = ?', [req.params.id]);
      saveDb(db);
      res.json({ success: true, message: 'FAQ deleted' });
    } catch (error) {
      console.error('Delete FAQ error:', error);
      res.status(500).json({ error: 'Failed to delete FAQ' });
    }
  });

  // SEO: robots.txt
  app.get('/robots.txt', (_req: Request, res: Response) => {
    res.type('text/plain');
    res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/admin\n\nSitemap: /sitemap.xml\n`);
  });

  // SEO: sitemap.xml
  app.get('/sitemap.xml', (_req: Request, res: Response) => {
    res.type('application/xml');
    const today = new Date().toISOString().slice(0, 10);
    const routes = [
      { path: '', priority: '1.0', changefreq: 'daily' },
      { path: 'about', priority: '0.8', changefreq: 'weekly' },
      { path: 'services', priority: '0.9', changefreq: 'weekly' },
      { path: 'online-consultation', priority: '0.9', changefreq: 'weekly' },
      { path: 'appointments', priority: '0.9', changefreq: 'weekly' },
      { path: 'gallery', priority: '0.8', changefreq: 'weekly' },
      { path: 'reviews', priority: '0.8', changefreq: 'daily' },
      { path: 'faq', priority: '0.7', changefreq: 'weekly' },
      { path: 'contact', priority: '0.7', changefreq: 'monthly' },
      { path: 'booking-status', priority: '0.6', changefreq: 'monthly' },
      { path: 'privacy-policy', priority: '0.4', changefreq: 'yearly' },
      { path: 'terms', priority: '0.4', changefreq: 'yearly' },
      { path: 'disclaimer', priority: '0.4', changefreq: 'yearly' },
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>https://kivaphysiotherapy.com/${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
    res.send(xml);
  });

  // Admin: Securely View / Download File
  app.get('/api/admin/files/:fileId', requireAdmin, async (req: Request, res: Response) => {
    try {
      const fileId = req.params.fileId;
      const fileResult = await storage.getFile(fileId);

      if (!fileResult) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      const { buffer, meta } = fileResult;
      res.setHeader('Content-Type', meta.mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(meta.originalName)}"`);
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.send(buffer);
    } catch (error) {
      console.error('File view error:', error);
      res.status(500).json({ error: 'Failed to load file' });
    }
  });

  // ----------------------------------------------------
  // Vite Middleware / Production Static Serve
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kiva Physiotherapy Clinic server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
