import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { hashPassword } from './auth.js';

let dbInstance: Database | null = null;
const dbDir = path.join(process.cwd(), 'data');
const dbFilePath = path.join(dbDir, 'kiva.sqlite');

export async function getDb(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const SQL = await initSqlJs();
  if (fs.existsSync(dbFilePath)) {
    const fileBuffer = fs.readFileSync(dbFilePath);
    dbInstance = new SQL.Database(fileBuffer);
  } else {
    dbInstance = new SQL.Database();
  }

  initSchema(dbInstance);
  saveDb(dbInstance);
  return dbInstance;
}

export function saveDb(db?: Database) {
  const currentDb = db || dbInstance;
  if (!currentDb) return;
  const data = currentDb.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbFilePath, buffer);
}

function initSchema(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      full_name TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS patient_information (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      city_country TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      patient_id INTEGER NOT NULL,
      problem_description TEXT NOT NULL,
      problem_duration TEXT NOT NULL,
      pain_level INTEGER NOT NULL,
      has_medical_reports INTEGER NOT NULL DEFAULT 0,
      preferred_time TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'NEW',
      confirmed_date TEXT,
      confirmed_time TEXT,
      video_link TEXT,
      is_demo INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (patient_id) REFERENCES patient_information(id)
    );

    CREATE TABLE IF NOT EXISTS medical_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      appointment_id TEXT NOT NULL,
      file_id TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (appointment_id) REFERENCES appointments(id)
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      appointment_id TEXT NOT NULL,
      amount INTEGER NOT NULL DEFAULT 500,
      currency TEXT NOT NULL DEFAULT 'INR',
      method TEXT NOT NULL,
      payment_number TEXT NOT NULL,
      screenshot_file_id TEXT,
      screenshot_original_name TEXT,
      screenshot_mime_type TEXT,
      screenshot_size INTEGER,
      status TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION',
      created_at TEXT NOT NULL,
      FOREIGN KEY (appointment_id) REFERENCES appointments(id)
    );

    CREATE TABLE IF NOT EXISTS appointment_status (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      appointment_id TEXT NOT NULL,
      status TEXT NOT NULL,
      changed_by TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (appointment_id) REFERENCES appointments(id)
    );

    CREATE TABLE IF NOT EXISTS admin_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      appointment_id TEXT NOT NULL,
      author TEXT NOT NULL,
      note_text TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (appointment_id) REFERENCES appointments(id)
    );

    CREATE TABLE IF NOT EXISTS clinic_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      short_description TEXT NOT NULL,
      full_description TEXT,
      icon_name TEXT DEFAULT 'Activity',
      image_url TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS gallery_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL DEFAULT 'Clinic',
      image_url TEXT NOT NULL,
      display_order INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      is_published INTEGER DEFAULT 1,
      is_demo INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_name TEXT NOT NULL,
      city TEXT,
      age INTEGER,
      rating INTEGER,
      review_text TEXT NOT NULL,
      photo_url TEXT,
      status TEXT NOT NULL DEFAULT 'PENDING_APPROVAL',
      is_featured INTEGER DEFAULT 0,
      has_consent INTEGER NOT NULL DEFAULT 1,
      is_demo INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1
    );
  `);

  // Seed default admin if not exists
  const adminRes = db.exec("SELECT id FROM users WHERE username = 'admin'");
  if (adminRes.length === 0 || adminRes[0].values.length === 0) {
    const adminPasswordHash = hashPassword('kiva-clinic-2026');
    db.run(
      `INSERT INTO users (username, password_hash, role, full_name, created_at)
       VALUES (?, ?, 'admin', 'Kiva Clinic Administrator', datetime('now'))`,
      ['admin', adminPasswordHash]
    );
  }

  // Seed realistic demo appointments if none exist
  const apptRes = db.exec('SELECT id FROM appointments LIMIT 1');
  if (apptRes.length === 0 || apptRes[0].values.length === 0) {
    seedDemoData(db);
  }

  // Seed clinic settings if none exist
  seedClinicSettings(db);

  // Seed initial services if none exist
  seedServices(db);

  // Seed gallery if none exist
  seedGallery(db);

  // Seed reviews if none exist
  seedReviews(db);

  // Seed FAQs if none exist
  seedFaqs(db);
}

function seedClinicSettings(db: Database) {
  const settingsRes = db.exec('SELECT key FROM clinic_settings LIMIT 1');
  if (settingsRes.length === 0 || settingsRes[0].values.length === 0) {
    const defaultSettings: Record<string, string> = {
      clinic_name: 'Kiva Physiotherapy Clinic',
      tagline: 'Move Better. Recover Better. Live Better.',
      logo_url: '',
      hero_headline: 'Move Better. Recover Better. Live Better.',
      hero_description: 'Professional physiotherapy consultation and personalized guidance designed around your individual needs.',
      hero_image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
      whatsapp_number: '9875138912',
      phone_number: '9875138912',
      email_address: 'consult@kivaphysio.com',
      consultation_fee: '500',
      payment_number: '9875138912',
      payment_methods: 'PhonePe, Paytm, Google Pay',
      opening_hours: 'Monday – Saturday: 9:00 AM – 8:00 PM (IST)',
      address: 'Tele-Rehabilitation & Online Virtual Clinic',
      announcement_banner: 'Accepting appointments for comprehensive online assessments and structured video rehabilitation.',
      social_instagram: '',
      social_facebook: '',
      social_youtube: '',
      therapist_name: '',
      therapist_qualification: '',
      therapist_photo: '',
      therapist_experience: '',
      therapist_specializations: '',
      therapist_bio: '',
      about_intro: 'Kiva Physiotherapy Clinic delivers patient-centered functional evaluation, evidence-based pain management guidance, and personalized physical rehabilitation plans via high-definition video consultations.',
      about_approach: 'Our approach combines in-depth movement observation, ergonomic lifestyle analysis, guided therapeutic exercises, and routine symptom tracking to support recovery and long-term joint health.',
    };

    for (const [key, val] of Object.entries(defaultSettings)) {
      db.run('INSERT OR REPLACE INTO clinic_settings (key, value) VALUES (?, ?)', [key, val]);
    }
  }
}

function seedServices(db: Database) {
  const servicesRes = db.exec('SELECT id FROM services LIMIT 1');
  if (servicesRes.length === 0 || servicesRes[0].values.length === 0) {
    const defaultServices = [
      {
        name: 'Physiotherapy Consultation',
        short_description: 'Comprehensive functional assessment, movement screening, and tailored recovery recommendations.',
        full_description: 'One-on-one professional clinical evaluation focusing on posture, joint range of motion, muscle balance, and biomechanical patterns. We analyze symptom triggers and design a structured path toward functional improvement.',
        icon_name: 'Activity',
        image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
        display_order: 1
      },
      {
        name: 'Online Physiotherapy Consultation',
        short_description: 'Virtual video consultation with symptom discussion, functional movement observation, and report evaluation.',
        full_description: 'Conducted securely over high-definition video. The therapist evaluates active movement limitations, discusses daily postural strains, examines uploaded MRI or X-ray reports, and demonstrates corrective home rehabilitation exercises.',
        icon_name: 'Video',
        image_url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
        display_order: 2
      },
      {
        name: 'Pain Management',
        short_description: 'Conservative therapeutic strategies for spine, joint, neck, and muscular aches.',
        full_description: 'Targeted non-invasive techniques designed to reduce acute and persistent musculoskeletal discomfort through active movement modulation, load management guidance, and self-care mobility routines.',
        icon_name: 'HeartHandshake',
        image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
        display_order: 3
      },
      {
        name: 'Rehabilitation',
        short_description: 'Progressive post-injury and post-operative recovery regimens to restore strength and function.',
        full_description: 'Structured phased rehabilitation plans matching your healing timeline. Emphasizes stability, controlled progressive loading, neuromuscular control, and safe return to routine daily activities.',
        icon_name: 'ShieldCheck',
        image_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
        display_order: 4
      },
      {
        name: 'Exercise Guidance',
        short_description: 'Personalized therapeutic exercise prescriptions with correct postural form instruction.',
        full_description: 'Step-by-step home exercise protocols specifically tailored to your body mechanics. Each movement is carefully explained and demonstrated with rep counts, hold times, and pacing cues.',
        icon_name: 'Dumbbell',
        image_url: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80',
        display_order: 5
      },
      {
        name: 'Mobility & Movement Assessment',
        short_description: 'Systematic analysis of flexibility, joint alignment, and functional daily movements.',
        full_description: 'In-depth functional screening assessing movement quality, asymmetries, kinetic chain compensations, and workspace ergonomics to prevent strain and optimize physical performance.',
        icon_name: 'TrendingUp',
        image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
        display_order: 6
      }
    ];

    for (const s of defaultServices) {
      db.run(
        `INSERT INTO services (name, short_description, full_description, icon_name, image_url, display_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?, 1)`,
        [s.name, s.short_description, s.full_description, s.icon_name, s.image_url, s.display_order]
      );
    }
  }
}

function seedGallery(db: Database) {
  const galleryRes = db.exec('SELECT id FROM gallery_images LIMIT 1');
  if (galleryRes.length === 0 || galleryRes[0].values.length === 0) {
    const defaultGallery = [
      {
        title: 'Modern Clinical Assessment Room',
        description: 'Clean, well-equipped assessment environment designed for patient mobility evaluations.',
        category: 'Clinic',
        image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
        is_featured: 1,
        display_order: 1
      },
      {
        title: 'Guided Spinal Posture & Ergonomic Screening',
        description: 'Demonstrating functional cervical alignment and ergonomic posture for desk professionals.',
        category: 'Physiotherapy',
        image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
        is_featured: 1,
        display_order: 2
      },
      {
        title: 'Resistance Bands & Therapeutic Mobility Equipment',
        description: 'High-grade rehabilitation bands and movement tools for controlled progressive loading.',
        category: 'Equipment',
        image_url: 'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?auto=format&fit=crop&w=800&q=80',
        is_featured: 1,
        display_order: 3
      },
      {
        title: 'Digital Tele-Consultation & Exercise Demonstration',
        description: 'Live interactive tele-rehabilitation session guiding patients through corrective movement.',
        category: 'Physiotherapy',
        image_url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
        is_featured: 1,
        display_order: 4
      },
      {
        title: 'Lower Limb Functional Movement Assessment',
        description: 'Systematic observation of knee and ankle mechanics during controlled kinetic movements.',
        category: 'Physiotherapy',
        image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
        is_featured: 0,
        display_order: 5
      },
      {
        title: 'Therapeutic Balance & Core Rehabilitation Tools',
        description: 'Specialized stability discs and rollers supporting proprioceptive recovery.',
        category: 'Equipment',
        image_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
        is_featured: 0,
        display_order: 6
      }
    ];

    const nowIso = new Date().toISOString();
    for (const g of defaultGallery) {
      db.run(
        `INSERT INTO gallery_images (title, description, category, image_url, display_order, is_featured, is_published, is_demo, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 1, 1, ?)`,
        [g.title, g.description, g.category, g.image_url, g.display_order, g.is_featured, nowIso]
      );
    }
  }
}

function seedReviews(db: Database) {
  const reviewsRes = db.exec('SELECT id FROM reviews LIMIT 1');
  if (reviewsRes.length === 0 || reviewsRes[0].values.length === 0) {
    const nowIso = new Date().toISOString();
    const defaultReviews = [
      {
        patient_name: 'Anjali Sharma',
        city: 'Mumbai',
        rating: 5,
        review_text: 'The online consultation was very thorough. The physiotherapist patiently analyzed my desk posture, asked detailed questions about my shoulder pain, and demonstrated specific mobility exercises that brought genuine relief.',
        photo_url: '',
        status: 'APPROVED',
        is_featured: 1,
        is_demo: 1,
      },
      {
        patient_name: 'Vikram Joshi',
        city: 'Pune',
        rating: 5,
        review_text: 'I was hesitant about how effective a video consultation could be for knee discomfort, but the guidance was clear, precise, and practical. Having the session from home saved significant commute time.',
        photo_url: '',
        status: 'APPROVED',
        is_featured: 1,
        is_demo: 1,
      },
      {
        patient_name: 'Sunita Rao',
        city: 'Bengaluru',
        rating: 5,
        review_text: 'Clear explanations of my lower back issues without any jargon. The exercise plan was easy to follow and structured around my daily work routine.',
        photo_url: '',
        status: 'APPROVED',
        is_featured: 1,
        is_demo: 1,
      },
      {
        patient_name: 'Karan Mehra',
        city: 'Delhi',
        rating: 5,
        review_text: 'Submitted my MRI report before the session. The therapist had already reviewed it when we started the call and explained the findings calmly with helpful rehabilitation tips.',
        photo_url: '',
        status: 'PENDING_APPROVAL', // Demonstrates pending approval in admin panel!
        is_featured: 0,
        is_demo: 1,
      }
    ];

    for (const r of defaultReviews) {
      db.run(
        `INSERT INTO reviews (patient_name, city, rating, review_text, photo_url, status, is_featured, has_consent, is_demo, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
        [r.patient_name, r.city, r.rating, r.review_text, r.photo_url, r.status, r.is_featured, r.is_demo, nowIso]
      );
    }
  }
}

function seedFaqs(db: Database) {
  const faqsRes = db.exec('SELECT id FROM faqs LIMIT 1');
  if (faqsRes.length === 0 || faqsRes[0].values.length === 0) {
    const defaultFaqs = [
      {
        question: 'What happens during an online consultation?',
        answer: 'During the video consultation, the physiotherapist conducts a thorough verbal assessment of your medical history, symptoms, and daily routine. You will be asked to perform specific, gentle active movements on camera so the therapist can evaluate range of motion, muscle balance, and pain patterns. You will receive customized exercise instruction and lifestyle advice.',
        category: 'Consultation',
        display_order: 1
      },
      {
        question: 'How much does an online consultation cost?',
        answer: 'The standard online physiotherapy consultation fee is ₹500. This includes comprehensive functional assessment, discussion of symptoms, review of any uploaded medical reports, and an individualized home rehabilitation plan.',
        category: 'Pricing & Payment',
        display_order: 2
      },
      {
        question: 'How do I book an appointment?',
        answer: 'Click "Book Appointment", fill out your basic patient details and health concerns, select your preferred consultation window (Morning, Afternoon, or Evening), and complete the payment using PhonePe, Paytm, or Google Pay. Once submitted, our clinic team reviews the request and confirms your slot.',
        category: 'Booking',
        display_order: 3
      },
      {
        question: 'How do I pay for my consultation?',
        answer: 'We accept direct UPI transfers via PhonePe, Paytm, and Google Pay to our clinic payment number: 9875138912. You can upload a screenshot or reference of the transaction during booking for quick verification.',
        category: 'Pricing & Payment',
        display_order: 4
      },
      {
        question: 'Can I upload MRI/X-ray reports?',
        answer: 'Yes. In Step 2 of the booking form, you can securely upload up to 5 medical documents including X-rays, MRI scans, CT reports, or doctor prescriptions in PDF, JPG, or PNG format (up to 25MB each). These remain strictly confidential and accessible only to the treating clinical team.',
        category: 'Medical & Reports',
        display_order: 5
      },
      {
        question: 'How do I receive my consultation link?',
        answer: 'Once your payment is verified and your time slot is scheduled, our clinic updates your appointment with a secure Google Meet video link. You can track this in real-time on our "Track Booking Status" page using your Appointment ID and phone/email, and we will also reach out via WhatsApp.',
        category: 'Consultation',
        display_order: 6
      },
      {
        question: 'Can I reschedule my appointment?',
        answer: 'Yes. If you need to reschedule your confirmed consultation, please contact our clinic on WhatsApp at 9875138912 with your Appointment ID at least 4 hours before your scheduled session.',
        category: 'Booking',
        display_order: 7
      },
      {
        question: 'What happens after submitting my appointment request?',
        answer: 'Immediately upon submission, you receive a unique Appointment Request ID (e.g. KIVA-2026-XXXX). Your request is marked as "Payment Verification". Our clinic team verifies the payment receipt, coordinates the best specific time slot matching your preferred window, confirms the appointment, and issues your secure video consultation link.',
        category: 'Booking',
        display_order: 8
      }
    ];

    for (const f of defaultFaqs) {
      db.run(
        `INSERT INTO faqs (question, answer, category, display_order, is_active)
         VALUES (?, ?, ?, ?, 1)`,
        [f.question, f.answer, f.category, f.display_order]
      );
    }
  }
}

function seedDemoData(db: Database) {
  // Demo 1: Confirmed appointment
  db.run(`
    INSERT INTO patient_information (id, full_name, age, gender, phone, email, city_country, created_at)
    VALUES (1, 'Rohan Verma', 34, 'Male', '9875138912', 'rohan.demo@example.com', 'Mumbai, India', datetime('now', '-2 days'))
  `);

  db.run(`
    INSERT INTO appointments (id, patient_id, problem_description, problem_duration, pain_level, has_medical_reports, preferred_time, status, confirmed_date, confirmed_time, video_link, is_demo, created_at, updated_at)
    VALUES ('KIVA-DEMO-1001', 1, 'Persistent cervical stiffness and shoulder discomfort aggravated by computer desk work.', '3 weeks', 5, 1, 'Morning', 'CONFIRMED', '2026-09-22', '10:30 AM IST', 'https://meet.google.com/kiv-phys-demo', 1, datetime('now', '-2 days'), datetime('now', '-1 day'))
  `);

  db.run(`
    INSERT INTO payments (appointment_id, amount, currency, method, payment_number, status, created_at)
    VALUES ('KIVA-DEMO-1001', 500, 'INR', 'Google Pay', '9875138912', 'VERIFIED', datetime('now', '-2 days'))
  `);

  db.run(`
    INSERT INTO appointment_status (appointment_id, status, changed_by, notes, created_at)
    VALUES ('KIVA-DEMO-1001', 'CONFIRMED', 'Admin', 'Payment received via GPay. Video consultation scheduled and link dispatched.', datetime('now', '-1 day'))
  `);

  db.run(`
    INSERT INTO admin_notes (appointment_id, author, note_text, created_at)
    VALUES ('KIVA-DEMO-1001', 'Dr. Team', '[DEMO DATA - CLINIC PREVIEW] Cervical range of motion assessment planned. Advised to keep chair and desk space cleared for posture assessment.', datetime('now', '-1 day'))
  `);

  // Demo 2: Payment verification pending
  db.run(`
    INSERT INTO patient_information (id, full_name, age, gender, phone, email, city_country, created_at)
    VALUES (2, 'Pooja Iyer', 28, 'Female', '9875138912', 'pooja.demo@example.com', 'Bengaluru, India', datetime('now', '-5 hours'))
  `);

  db.run(`
    INSERT INTO appointments (id, patient_id, problem_description, problem_duration, pain_level, has_medical_reports, preferred_time, status, is_demo, created_at, updated_at)
    VALUES ('KIVA-DEMO-1002', 2, 'Acute lower back pain after lifting luggage. Discomfort when bending forward or sitting long periods.', '5 days', 6, 0, 'Evening', 'PAYMENT VERIFICATION', 1, datetime('now', '-5 hours'), datetime('now', '-5 hours'))
  `);

  db.run(`
    INSERT INTO payments (appointment_id, amount, currency, method, payment_number, status, created_at)
    VALUES ('KIVA-DEMO-1002', 500, 'INR', 'PhonePe', '9875138912', 'PENDING_VERIFICATION', datetime('now', '-5 hours'))
  `);

  db.run(`
    INSERT INTO appointment_status (appointment_id, status, changed_by, notes, created_at)
    VALUES ('KIVA-DEMO-1002', 'PAYMENT VERIFICATION', 'System', 'Patient uploaded payment confirmation reference.', datetime('now', '-5 hours'))
  `);

  // Demo 3: New request
  db.run(`
    INSERT INTO patient_information (id, full_name, age, gender, phone, email, city_country, created_at)
    VALUES (3, 'Anand Kulkarni', 45, 'Male', '9875138912', 'anand.demo@example.com', 'Pune, India', datetime('now', '-1 hour'))
  `);

  db.run(`
    INSERT INTO appointments (id, patient_id, problem_description, problem_duration, pain_level, has_medical_reports, preferred_time, status, is_demo, created_at, updated_at)
    VALUES ('KIVA-DEMO-1003', 3, 'Mild knee stiffness and patellar discomfort after evening jog. Seeking preventive exercise regimen.', '2 months', 3, 0, 'Afternoon', 'NEW', 1, datetime('now', '-1 hour'), datetime('now', '-1 hour'))
  `);

  db.run(`
    INSERT INTO payments (appointment_id, amount, currency, method, payment_number, status, created_at)
    VALUES ('KIVA-DEMO-1003', 500, 'INR', 'Paytm', '9875138912', 'PENDING_VERIFICATION', datetime('now', '-1 hour'))
  `);

  db.run(`
    INSERT INTO appointment_status (appointment_id, status, changed_by, notes, created_at)
    VALUES ('KIVA-DEMO-1003', 'NEW', 'System', 'Appointment request submitted with Paytm payment details.', datetime('now', '-1 hour'))
  `);
}
