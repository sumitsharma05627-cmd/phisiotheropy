export type Gender = 'Male' | 'Female';

export type PainCategory = 'No Pain' | 'Mild' | 'Moderate' | 'Severe';

export type ConsultationTimeSlot = 'Morning' | 'Afternoon' | 'Evening';

export type BookingStatus =
  | 'NEW'
  | 'PAYMENT VERIFICATION'
  | 'CONFIRMED'
  | 'RESCHEDULED'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED';

export interface PatientDetails {
  fullName: string;
  age: number | '';
  gender: Gender | '';
  phone: string;
  email: string;
  cityCountry: string;
}

export interface HealthInformation {
  problemDescription: string;
  problemDuration: string;
  painLevel: number;
  hasMedicalReports: boolean;
}

export interface UploadedFilePayload {
  name: string;
  mimeType: string;
  base64: string;
  size: number;
}

export interface BookingFormData {
  patient: PatientDetails;
  health: HealthInformation;
  schedule: {
    preferredTime: ConsultationTimeSlot;
  };
  payment: {
    method: string;
    confirmedCorrect: boolean;
  };
  files: {
    medicalReports: UploadedFilePayload[];
    paymentScreenshot: UploadedFilePayload | null;
  };
}

export interface BookingSubmissionResponse {
  success: boolean;
  appointmentId: string;
  patientName: string;
  preferredTime: ConsultationTimeSlot;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  consultationFee: number;
  createdAt: string;
}

export interface PatientStatusResult {
  appointmentId: string;
  patientNameMasked: string;
  requestReceivedAt: string;
  preferredTime: ConsultationTimeSlot;
  paymentStatus: PaymentStatus;
  appointmentStatus: BookingStatus;
  confirmedDate: string | null;
  confirmedTime: string | null;
  videoLink: string | null;
}

export interface AdminAppointmentSummary {
  id: string;
  status: BookingStatus;
  pain_level: number;
  preferred_time: ConsultationTimeSlot;
  confirmed_date: string | null;
  confirmed_time: string | null;
  video_link: string | null;
  is_demo: number;
  created_at: string;
  updated_at: string;
  full_name: string;
  phone: string;
  email: string;
  age: number;
  gender: Gender;
  city_country: string;
  payment_status: PaymentStatus;
  payment_method: string;
  reports_count: number;
  notes_count: number;
}

export interface AdminAppointmentDetail {
  appointment: {
    id: string;
    patient_id: number;
    problem_description: string;
    problem_duration: string;
    pain_level: number;
    has_medical_reports: number;
    preferred_time: ConsultationTimeSlot;
    status: BookingStatus;
    confirmed_date: string | null;
    confirmed_time: string | null;
    video_link: string | null;
    is_demo: number;
    created_at: string;
    updated_at: string;
    full_name: string;
    age: number;
    gender: Gender;
    phone: string;
    email: string;
    city_country: string;
  };
  medicalReports: Array<{
    id: number;
    file_id: string;
    original_name: string;
    mime_type: string;
    file_size: number;
    created_at: string;
  }>;
  payment: {
    id: number;
    amount: number;
    currency: string;
    method: string;
    payment_number: string;
    screenshot_file_id: string | null;
    screenshot_original_name: string | null;
    screenshot_size: number | null;
    status: PaymentStatus;
    created_at: string;
  } | null;
  statusHistory: Array<{
    id: number;
    status: BookingStatus;
    changed_by: string;
    notes: string;
    created_at: string;
  }>;
  notes: Array<{
    id: number;
    author: string;
    note_text: string;
    created_at: string;
  }>;
}

export interface ClinicSettings {
  clinic_name?: string;
  tagline?: string;
  logo_url?: string;
  hero_headline?: string;
  hero_description?: string;
  hero_image_url?: string;
  whatsapp_number?: string;
  phone_number?: string;
  email_address?: string;
  consultation_fee?: string;
  payment_number?: string;
  payment_methods?: string;
  opening_hours?: string;
  address?: string;
  announcement_banner?: string;
  social_instagram?: string;
  social_facebook?: string;
  social_youtube?: string;
  therapist_name?: string;
  therapist_qualification?: string;
  therapist_photo?: string;
  therapist_experience?: string;
  therapist_specializations?: string;
  therapist_bio?: string;
  about_intro?: string;
  about_approach?: string;
}

export interface ClinicService {
  id: number;
  name: string;
  short_description: string;
  full_description: string;
  icon_name: string;
  image_url: string;
  display_order: number;
  is_active?: number;
}

export type GalleryCategory =
  | 'All'
  | 'Clinic'
  | 'Physiotherapy'
  | 'Equipment'
  | 'Team'
  | 'Patient Experience'
  | 'Events'
  | 'Other';

export interface GalleryImage {
  id: number;
  title: string;
  description: string;
  caption?: string;
  category: GalleryCategory;
  image_url: string;
  display_order: number;
  is_featured: number;
  is_published?: number;
  is_demo?: number;
  created_at?: string;
}

export interface PatientReview {
  id: number;
  patient_name: string;
  city?: string | null;
  age?: number | null;
  rating?: number | null;
  review_text: string;
  photo_url?: string | null;
  patient_photo_url?: string | null;
  condition_treated?: string | null;
  status?: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'pending';
  is_featured?: number;
  has_consent?: number;
  is_demo?: number;
  created_at?: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_active?: number;
}

export type ClinicFaq = FaqItem;

export interface PublicContentResponse {
  settings: ClinicSettings;
  services: ClinicService[];
  featuredGallery: GalleryImage[];
  featuredReviews: PatientReview[];
  faqs: FaqItem[];
}

export interface AdminOverviewMetrics {
  appointmentsToday: number;
  newRequests: number;
  pendingPayments: number;
  confirmedAppointments: number;
  pendingReviews: number;
  pendingPhotos: number;
  totalAppointments: number;
}

