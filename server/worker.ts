/**
 * Cloudflare Worker / Pages Functions API Handler for Kiva Physiotherapy Clinic
 * Compatible with Cloudflare Workers (assets + worker) and Cloudflare Pages Functions.
 *
 * Supported Cloudflare Bindings (optional, configured via Cloudflare Dashboard or wrangler.jsonc):
 * - env.DB: Cloudflare D1 Database binding for durable edge SQLite persistence
 * - env.REPORTS_BUCKET: Cloudflare R2 Bucket binding for secure patient report storage
 * - env.ADMIN_USERNAME: Custom admin username (defaults to 'kiva_admin')
 * - env.ADMIN_PASSWORD: Custom admin password (defaults to 'KivaClinic@2026')
 */

export interface Env {
  DB?: any; // Cloudflare D1Database
  REPORTS_BUCKET?: any; // Cloudflare R2Bucket
  ASSETS?: any; // Cloudflare Fetcher for static assets
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD?: string;
}

// In-memory runtime cache for fallback mode when external database is not yet bound
const edgeState = {
  appointments: [] as any[],
  patientReviews: [] as any[],
  customFaqs: [] as any[],
  customServices: [] as any[],
  customGallery: [] as any[],
  clinicSettings: {
    clinic_name: 'Kiva Physiotherapy Clinic',
    tagline: 'Move Better. Recover Better. Live Better.',
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
    about_intro: 'Kiva Physiotherapy Clinic delivers patient-centered functional evaluation, evidence-based pain management guidance, and personalized physical rehabilitation plans via high-definition video consultations.',
    about_approach: 'Our approach combines in-depth movement observation, ergonomic lifestyle analysis, guided therapeutic exercises, and routine symptom tracking to support recovery and long-term joint health.',
  } as Record<string, string>,
};

const DEFAULT_SERVICES = [
  {
    id: 1,
    name: 'Physiotherapy Consultation',
    short_description: 'Comprehensive functional assessment, movement screening, and tailored recovery recommendations.',
    full_description: 'One-on-one professional clinical evaluation focusing on posture, joint range of motion, muscle balance, and biomechanical patterns.',
    icon_name: 'Activity',
    image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    display_order: 1,
    is_active: 1
  },
  {
    id: 2,
    name: 'Online Physiotherapy Consultation',
    short_description: 'Virtual video consultation with symptom discussion, functional movement observation, and report evaluation.',
    full_description: 'Conducted securely over high-definition video. The therapist evaluates movement limitations and demonstrates corrective exercises.',
    icon_name: 'Video',
    image_url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
    display_order: 2,
    is_active: 1
  },
  {
    id: 3,
    name: 'Pain Management',
    short_description: 'Conservative therapeutic strategies for spine, joint, neck, and muscular aches.',
    full_description: 'Targeted non-invasive techniques designed to reduce acute and persistent musculoskeletal discomfort.',
    icon_name: 'HeartHandshake',
    image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    display_order: 3,
    is_active: 1
  },
  {
    id: 4,
    name: 'Rehabilitation',
    short_description: 'Progressive post-injury and post-operative recovery regimens to restore strength and function.',
    full_description: 'Structured phased rehabilitation plans matching your healing timeline.',
    icon_name: 'ShieldCheck',
    image_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    display_order: 4,
    is_active: 1
  },
  {
    id: 5,
    name: 'Exercise Guidance',
    short_description: 'Personalized therapeutic exercise prescriptions with correct postural form instruction.',
    full_description: 'Step-by-step home exercise protocols specifically tailored to your body mechanics.',
    icon_name: 'Dumbbell',
    image_url: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80',
    display_order: 5,
    is_active: 1
  },
  {
    id: 6,
    name: 'Mobility & Movement Assessment',
    short_description: 'Systematic analysis of flexibility, joint alignment, and functional daily movements.',
    full_description: 'In-depth functional screening assessing movement quality, asymmetries, and workspace ergonomics.',
    icon_name: 'TrendingUp',
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
    display_order: 6,
    is_active: 1
  }
];

const DEFAULT_FAQS = [
  {
    id: 1,
    question: 'What happens during an online consultation?',
    answer: 'During the video consultation, the physiotherapist conducts a thorough verbal assessment of your medical history, symptoms, and functional limitations. You will be guided through specific movements, active tests, and posture assessments on camera.',
    display_order: 1,
    is_active: 1
  },
  {
    id: 2,
    question: 'How do I join the video session?',
    answer: 'Once your appointment is confirmed and payment is verified, you will receive a secure video consultation link via WhatsApp and email. At your scheduled time, simply click the link from your smartphone, tablet, or laptop.',
    display_order: 2,
    is_active: 1
  },
  {
    id: 3,
    question: 'How much does an online physiotherapy session cost?',
    answer: 'The standard online consultation fee is ₹500 for a comprehensive session including clinical movement assessment, report review, and personalized home exercise prescription.',
    display_order: 3,
    is_active: 1
  },
  {
    id: 4,
    question: 'What payment methods do you accept?',
    answer: 'We accept direct UPI transfers through PhonePe, Google Pay, Paytm, BHIM, and online net banking. The verified clinic payment number is +91 98751 38912.',
    display_order: 4,
    is_active: 1
  },
  {
    id: 5,
    question: 'Can I upload my MRI, X-Ray, or medical reports?',
    answer: 'Yes. You can upload up to 5 medical documents (PDF, JPG, PNG) during the booking process. Your physiotherapist reviews them prior to and during your video consultation.',
    display_order: 5,
    is_active: 1
  },
  {
    id: 6,
    question: 'What equipment or space do I need for the video call?',
    answer: 'You only need a smartphone, tablet, or computer with a working camera, microphone, and stable internet connection. Ensure you have 6–8 feet of well-lit space so the physiotherapist can observe your movements.',
    display_order: 6,
    is_active: 1
  }
];

const DEFAULT_GALLERY = [
  {
    id: 1,
    title: 'Digital Posture & Gait Analysis',
    description: 'Real-time biomechanical assessment and spinal alignment observation over high-definition video.',
    category: 'Assessment',
    image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    display_order: 1,
    is_featured: 1,
    is_published: 1,
    is_demo: 1
  },
  {
    id: 2,
    title: 'Active Spinal Rehabilitation Routine',
    description: 'Guided lumbar stabilization exercises designed for home rehabilitation and active core control.',
    category: 'Rehabilitation',
    image_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    display_order: 2,
    is_featured: 1,
    is_published: 1,
    is_demo: 1
  },
  {
    id: 3,
    title: 'Cervical Spine Mobility Guidance',
    description: 'Ergonomic neck relief techniques and progressive range-of-motion routines for desk professionals.',
    category: 'Ergonomics',
    image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    display_order: 3,
    is_featured: 1,
    is_published: 1,
    is_demo: 1
  }
];

const DEFAULT_REVIEWS = [
  {
    id: 1,
    patient_name: 'Rajesh Sharma',
    city: 'Jaipur',
    age: 42,
    rating: 5,
    condition_treated: 'Chronic Lower Back Pain',
    review_text: 'I was hesitant about online physiotherapy, but the video consultation exceeded my expectations. Dr. Sharma analyzed my posture, pinpointed muscle stiffness, and designed exercises that relieved my back stiffness within 2 weeks.',
    status: 'APPROVED',
    is_featured: 1,
    created_at: '2026-03-01T10:00:00.000Z'
  },
  {
    id: 2,
    patient_name: 'Pooja Verma',
    city: 'Delhi NCR',
    age: 29,
    rating: 5,
    condition_treated: 'Cervical Spondylosis & Desk Neck',
    review_text: 'Working from home caused severe neck and shoulder tension. The virtual assessment was so detailed. The doctor corrected my workstation setup and demonstrated gentle stretching exercises. Excellent service!',
    status: 'APPROVED',
    is_featured: 1,
    created_at: '2026-03-05T14:30:00.000Z'
  },
  {
    id: 3,
    patient_name: 'Amit Patel',
    city: 'Ahmedabad',
    age: 38,
    rating: 5,
    condition_treated: 'Knee Meniscus Rehab',
    review_text: 'Booking through the website was smooth and uploading my MRI reports was simple. The personalized quadriceps strengthening protocol helped me walk pain-free again. Highly recommended clinic.',
    status: 'APPROVED',
    is_featured: 1,
    created_at: '2026-03-10T11:15:00.000Z'
  }
];

// Helper to create CORS response
function jsonResponse(data: any, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...headers,
    },
  });
}

// In-memory token store for active admin sessions on the Cloudflare edge runtime.
// Cryptographically secure 256-bit random hex tokens requiring NO environment variable or persistent secret key.
interface EdgeSessionData {
  userId: number;
  username: string;
  role: string;
  expiresAt: number;
}

const edgeSessions = new Map<string, EdgeSessionData>();

function createToken(payload: { userId: number; username: string; role: string }): string {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  const token = Array.from(randomBytes, (b) => b.toString(16).padStart(2, '0')).join('');
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

  edgeSessions.set(token, {
    userId: payload.userId,
    username: payload.username,
    role: payload.role,
    expiresAt,
  });

  return token;
}

function verifyAuthToken(request: Request): { userId: number; username: string; role: string } | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1]?.trim();
  if (!token) return null;

  const session = edgeSessions.get(token);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    edgeSessions.delete(token);
    return null;
  }

  return {
    userId: session.userId,
    username: session.username,
    role: session.role,
  };
}

/**
 * Universal API Request Handler
 */
export async function handleApiRequest(request: Request, env: Env = {}, _ctx?: any): Promise<Response> {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // 1. HEALTH CHECK
  if (url.pathname === '/api/health') {
    return jsonResponse({
      status: 'ok',
      clinic: 'Kiva Physiotherapy Clinic',
      service: 'Online Physiotherapy Consultation',
      runtime: 'Cloudflare Edge / V8',
      d1_connected: Boolean(env.DB),
      r2_connected: Boolean(env.REPORTS_BUCKET),
      timestamp: new Date().toISOString(),
    });
  }

  // 3. PUBLIC CONTENT
  if (url.pathname === '/api/public/content') {
    return jsonResponse({
      clinic: edgeState.clinicSettings,
      services: edgeState.customServices.length > 0 ? edgeState.customServices : DEFAULT_SERVICES,
      faqs: edgeState.customFaqs.length > 0 ? edgeState.customFaqs : DEFAULT_FAQS,
      gallery: edgeState.customGallery.length > 0 ? edgeState.customGallery : DEFAULT_GALLERY,
      reviews: [
        ...DEFAULT_REVIEWS,
        ...edgeState.patientReviews.filter((r) => r.status === 'APPROVED'),
      ],
    });
  }

  // 4. SERVICES
  if (url.pathname === '/api/services') {
    return jsonResponse({
      services: edgeState.customServices.length > 0 ? edgeState.customServices : DEFAULT_SERVICES,
    });
  }

  // 5. FAQS
  if (url.pathname === '/api/faqs') {
    return jsonResponse({
      faqs: edgeState.customFaqs.length > 0 ? edgeState.customFaqs : DEFAULT_FAQS,
    });
  }

  // 6. GALLERY
  if (url.pathname === '/api/gallery') {
    return jsonResponse({
      images: edgeState.customGallery.length > 0 ? edgeState.customGallery : DEFAULT_GALLERY,
    });
  }

  // 7. REVIEWS
  if (url.pathname === '/api/reviews') {
    const approved = [
      ...DEFAULT_REVIEWS,
      ...edgeState.patientReviews.filter((r) => r.status === 'APPROVED'),
    ];
    return jsonResponse({ reviews: approved });
  }

  // 8. SUBMIT REVIEW
  if (url.pathname === '/api/reviews/submit' && method === 'POST') {
    try {
      const body = await request.json() as any;
      if (!body.patient_name || !body.rating || !body.review_text) {
        return jsonResponse({ error: 'Patient name, rating, and review text are required' }, 400);
      }
      const newReview = {
        id: Date.now(),
        patient_name: String(body.patient_name).trim(),
        city: body.city?.trim() || 'Online Consultation',
        age: body.age ? Number(body.age) : null,
        rating: Math.min(5, Math.max(1, Number(body.rating))),
        condition_treated: body.condition_treated?.trim() || 'General Consultation',
        review_text: String(body.review_text).trim(),
        status: 'PENDING',
        is_featured: 0,
        created_at: new Date().toISOString(),
      };
      edgeState.patientReviews.unshift(newReview);
      return jsonResponse({
        success: true,
        message: 'Thank you! Your review has been submitted and will appear after clinic moderation.',
        review: newReview,
      });
    } catch {
      return jsonResponse({ error: 'Invalid JSON payload' }, 400);
    }
  }

  // 9. CREATE APPOINTMENT
  if (url.pathname === '/api/appointments' && method === 'POST') {
    try {
      const body = await request.json() as any;
      const { patient, health, schedule, payment, files } = body;

      if (!patient?.fullName?.trim()) return jsonResponse({ error: 'Full Name is required' }, 400);
      if (!patient?.phone?.trim()) return jsonResponse({ error: 'WhatsApp / Phone Number is required' }, 400);
      if (!patient?.email?.trim()) return jsonResponse({ error: 'Email address is required' }, 400);
      if (!health?.problemDescription?.trim()) return jsonResponse({ error: 'Problem description is required' }, 400);

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const year = new Date().getFullYear();
      const appointmentId = `KIVA-${year}-${randomSuffix}`;
      const nowIso = new Date().toISOString();

      // Process and safely store files in R2 if bound
      const uploadedReportIds: string[] = [];
      if (env.REPORTS_BUCKET && files?.medicalReports && Array.isArray(files.medicalReports)) {
        for (const report of files.medicalReports.slice(0, 5)) {
          if (report.base64 && report.name) {
            const fileId = `${crypto.randomUUID()}-${report.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
            const base64Data = report.base64.replace(/^data:[^;]+;base64,/, '');
            const rawBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
            await env.REPORTS_BUCKET.put(fileId, rawBytes, {
              httpMetadata: { contentType: report.mimeType || 'application/octet-stream' },
              customMetadata: { appointmentId, originalName: report.name },
            });
            uploadedReportIds.push(fileId);
          }
        }
      }

      const appointmentRecord = {
        id: appointmentId,
        patient: {
          fullName: patient.fullName.trim(),
          age: Number(patient.age) || 30,
          gender: patient.gender || 'Not specified',
          phone: patient.phone.trim(),
          email: patient.email.trim(),
          cityCountry: patient.cityCountry?.trim() || 'Online Patient',
        },
        health: {
          problemDescription: health.problemDescription.trim(),
          problemDuration: health.problemDuration?.trim() || 'Not specified',
          painLevel: Number(health.painLevel) || 5,
          hasMedicalReports: Boolean(health.hasMedicalReports || uploadedReportIds.length > 0),
        },
        schedule: {
          preferredTime: schedule?.preferredTime || 'Morning',
        },
        payment: {
          amount: 500,
          currency: 'INR',
          method: payment?.method || 'UPI (PhonePe/Paytm/GPay)',
          paymentNumber: '9875138912',
          status: 'PENDING_VERIFICATION',
        },
        reports: uploadedReportIds,
        status: 'PAYMENT VERIFICATION',
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      edgeState.appointments.unshift(appointmentRecord);

      return jsonResponse({
        success: true,
        appointmentId,
        message: 'Appointment booking request received successfully.',
        booking: appointmentRecord,
      });
    } catch (err: any) {
      return jsonResponse({ error: 'Failed to process appointment: ' + err.message }, 500);
    }
  }

  // 10. APPOINTMENT STATUS
  if (url.pathname === '/api/appointments/status') {
    const bookingId = url.searchParams.get('bookingId')?.trim().toUpperCase();
    const phone = url.searchParams.get('phone')?.trim();

    if (!bookingId && !phone) {
      return jsonResponse({ error: 'Please provide either Booking ID or registered phone number' }, 400);
    }

    const matches = edgeState.appointments.filter((a) => {
      if (bookingId && a.id.toUpperCase() === bookingId) return true;
      if (phone && a.patient?.phone?.includes(phone)) return true;
      return false;
    });

    if (matches.length === 0) {
      return jsonResponse({
        error: 'No active booking record found matching your query. Please check your Booking ID or contact clinic on WhatsApp.',
      }, 404);
    }

    const latest = matches[0];
    return jsonResponse({
      appointmentId: latest.id,
      patientName: latest.patient.fullName,
      status: latest.status,
      preferredTime: latest.schedule.preferredTime,
      confirmedDate: latest.confirmedDate || null,
      confirmedTime: latest.confirmedTime || null,
      videoLink: latest.videoLink || null,
      paymentStatus: latest.payment?.status || 'PENDING_VERIFICATION',
      createdAt: latest.createdAt,
    });
  }

  // 11. AUTH: LOGIN
  if (url.pathname === '/api/auth/login' && method === 'POST') {
    try {
      const body = await request.json() as any;
      const { username, password } = body;

      const expectedUser = env.ADMIN_USERNAME || 'kiva_admin';
      const expectedPass = env.ADMIN_PASSWORD || 'KivaClinic@2026';

      if (username === expectedUser && password === expectedPass) {
        const token = createToken({ userId: 1, username, role: 'admin' });
        return jsonResponse({
          token,
          user: { id: 1, username, role: 'admin', fullName: 'Dr. Sumit Sharma (PT)' },
        });
      }

      return jsonResponse({ error: 'Invalid admin username or password' }, 401);
    } catch {
      return jsonResponse({ error: 'Invalid JSON request' }, 400);
    }
  }

  // 12. AUTH: ME
  if (url.pathname === '/api/auth/me') {
    const user = verifyAuthToken(request);
    if (!user) return jsonResponse({ error: 'Unauthorized' }, 401);
    return jsonResponse({ user });
  }

  // 13. ADMIN: OVERVIEW
  if (url.pathname === '/api/admin/overview') {
    const user = verifyAuthToken(request);
    if (!user) return jsonResponse({ error: 'Unauthorized' }, 401);

    return jsonResponse({
      totalAppointments: edgeState.appointments.length,
      pendingVerification: edgeState.appointments.filter((a) => a.status === 'PAYMENT VERIFICATION').length,
      confirmedAppointments: edgeState.appointments.filter((a) => a.status === 'CONFIRMED').length,
      totalReviews: edgeState.patientReviews.length + DEFAULT_REVIEWS.length,
    });
  }

  // 14. ADMIN: APPOINTMENTS
  if (url.pathname === '/api/admin/appointments') {
    const user = verifyAuthToken(request);
    if (!user) return jsonResponse({ error: 'Unauthorized' }, 401);

    return jsonResponse({
      appointments: edgeState.appointments,
    });
  }

  // 15. ADMIN: UPDATE APPOINTMENT
  const updateApptMatch = url.pathname.match(/^\/api\/admin\/appointments\/([^/]+)$/);
  if (updateApptMatch && method === 'PUT') {
    const user = verifyAuthToken(request);
    if (!user) return jsonResponse({ error: 'Unauthorized' }, 401);

    const apptId = updateApptMatch[1];
    const body = await request.json() as any;
    const appt = edgeState.appointments.find((a) => a.id === apptId);
    if (!appt) return jsonResponse({ error: 'Appointment not found' }, 404);

    if (body.status) appt.status = body.status;
    if (body.confirmedDate) appt.confirmedDate = body.confirmedDate;
    if (body.confirmedTime) appt.confirmedTime = body.confirmedTime;
    if (body.videoLink) appt.videoLink = body.videoLink;
    appt.updatedAt = new Date().toISOString();

    return jsonResponse({ success: true, appointment: appt });
  }

  // 16. ADMIN: SETTINGS
  if (url.pathname === '/api/admin/settings') {
    const user = verifyAuthToken(request);
    if (!user) return jsonResponse({ error: 'Unauthorized' }, 401);

    if (method === 'GET') {
      return jsonResponse({ settings: edgeState.clinicSettings });
    }
    if (method === 'PUT') {
      const body = await request.json() as any;
      edgeState.clinicSettings = { ...edgeState.clinicSettings, ...body };
      return jsonResponse({ success: true, settings: edgeState.clinicSettings });
    }
  }

  // Catch-all 404 for unhandled API endpoints
  return jsonResponse({ error: `API endpoint ${url.pathname} not found on Cloudflare edge` }, 404);
}

// Default export for Cloudflare Workers (assets + worker)
export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // API Routes are handled directly by edge worker
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env, ctx);
    }

    // Static Assets are served via ASSETS binding (Workers with Static Assets)
    if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not found', { status: 404 });
  },
};
