import React from 'react';
import { AlertTriangle, ShieldCheck, Phone, CalendarCheck, CheckCircle2 } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { Helmet } from 'react-helmet-async';
import { getCanonicalUrl, getOgImageUrl } from '../utils/seoHelper';

export const MedicalDisclaimerPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { settings } = useClinic();
  const canonicalUrl = getCanonicalUrl('/disclaimer');
  const ogImageUrl = getOgImageUrl('/kiva-logo.svg');
  const pageTitle = "Medical Disclaimer & Scope of Tele-Rehabilitation | Kiva Physiotherapy Clinic";
  const pageDescription = "Important clinical disclaimer on tele-physiotherapy scope, emergency limitations, non-invasive assessment boundaries, and physician consultation guidelines.";

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Kiva Physiotherapy Clinic" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:alt" content={pageTitle} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:image:alt" content={pageTitle} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-semibold px-3 py-1 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            <span>Clinical Notice</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Medical Disclaimer
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Important regulatory and clinical boundaries governing telemedicine and online physiotherapy consultations.
          </p>
        </div>

        {/* Primary Statement */}
        <div className="bg-amber-50/90 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 text-amber-950 space-y-4 shadow-sm">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0 mt-1" />
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-amber-950">
                Core Tele-Physiotherapy Scope & Limitation
              </h2>
              <p className="text-sm sm:text-base leading-relaxed font-medium">
                Online physiotherapy consultation is intended for assessment and professional guidance based on the information provided during the consultation. It may not be appropriate for every condition. In case of a medical emergency or symptoms requiring immediate physical examination, seek appropriate emergency medical care.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 space-y-8 shadow-sm text-sm text-slate-700 leading-relaxed">
          
          <section className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              1. Non-Emergency Nature of Service
            </h3>
            <p>
              Tele-physiotherapy services provided by Kiva Physiotherapy Clinic are strictly for non-urgent, elective musculoskeletal evaluations, posture coaching, post-surgical exercise progressions, and movement rehabilitation. If you experience chest pain, sudden numbness, paralysis, loss of bowel/bladder control, severe trauma, or acute head injuries, please contact local emergency medical services or visit the nearest hospital emergency room immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              2. Nature of Video-Based Assessment
            </h3>
            <p>
              While video assessments permit clinical observation of functional movement, gait, range of motion, and posture, they do not replace hands-on palpation, manual orthopaedic stress tests, or diagnostic imaging. The therapist relies on accurate, complete disclosure of your medical history, symptoms, previous surgeries, and investigation reports.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              3. Exercise Guidance & Patient Responsibility
            </h3>
            <p>
              All exercises prescribed during an online consultation are designed to be performed within your safe tolerance. If an exercise produces sharp or worsening pain, dizziness, or abnormal distress, you are advised to stop the activity immediately and inform the clinic.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              4. Referral & In-Person Evaluation Advice
            </h3>
            <p>
              If our physiotherapist determines during the consultation that your presentation requires hands-on physical therapy, advanced imaging, or specialist medical consultation (orthopaedic, neurological, or rheumatological), we will explicitly recommend an in-person clinical evaluation.
            </p>
          </section>

        </div>

        {/* Action button */}
        <div className="text-center pt-2">
          <button
            onClick={() => onNavigate('appointments')}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all"
          >
            <CalendarCheck className="w-5 h-5" />
            <span>Proceed to Appointment Booking (₹{settings.consultation_fee || '500'})</span>
          </button>
        </div>

      </div>
    </div>
  );
};
