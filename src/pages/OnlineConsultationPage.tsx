import React from 'react';
import { 
  CalendarCheck, 
  Video, 
  FileText, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Activity,
  Check,
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { Helmet } from 'react-helmet-async';
import { getCanonicalUrl, getOgImageUrl } from '../utils/seoHelper';
import { buildOnlineConsultationServiceSchema } from '../utils/seoSchemas';

interface OnlineConsultationPageProps {
  onNavigate: (page: string) => void;
}

export const OnlineConsultationPage: React.FC<OnlineConsultationPageProps> = ({ onNavigate }) => {
  const { settings, whatsappUrl } = useClinic();
  const fee = settings.consultation_fee || '500';
  const paymentNum = settings.payment_number || '9875138912';

  const canonicalUrl = getCanonicalUrl('/online-consultation');
  const ogImageUrl = getOgImageUrl('/kiva-logo.svg');
  const consultationSchema = buildOnlineConsultationServiceSchema(fee);

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <Helmet>
        <title>Online Physiotherapy Consultation & Video Assessment | Kiva Clinic</title>
        <meta name="title" content="Online Physiotherapy Consultation & Video Assessment | Kiva Clinic" />
        <meta 
          name="description" 
          content="Book a detailed virtual physiotherapy consultation for ₹500 with Dr. Naresh (PT). Live movement test, scan review, and personalized exercise therapy plan." 
        />
        <meta name="keywords" content="online physiotherapy consultation, virtual physio appointment, video physiotherapy assessment, telerehab session, online back pain consultation, Dr Naresh PT" />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Online Physiotherapy Consultation & Video Assessment | Kiva Clinic" />
        <meta 
          property="og:description" 
          content="Book a detailed virtual physiotherapy consultation for ₹500 with Dr. Naresh (PT). Live movement test, scan review, and personalized exercise therapy plan." 
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Kiva Physiotherapy Clinic" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:alt" content="Online Physiotherapy Consultation - Kiva Clinic" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Online Physiotherapy Consultation & Video Assessment | Kiva Clinic" />
        <meta 
          name="twitter:description" 
          content="Book a detailed virtual physiotherapy consultation for ₹500 with Dr. Naresh (PT). Live movement test, scan review, and personalized exercise therapy plan." 
        />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:image:alt" content="Online Physiotherapy Consultation - Kiva Clinic" />

        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(consultationSchema)}
        </script>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2.5 bg-teal-100/90 text-teal-900 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-teal-200 shadow-xs">
            <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-teal-600/30">
              <img src="/kiva-logo.svg" alt="Kiva Logo" className="w-full h-full object-contain" />
            </div>
            <span>Kiva Virtual Care Framework</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Online Physiotherapy Consultation
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Accessible, thorough virtual physiotherapy assessment designed for patients seeking professional clinical guidance and exercise rehabilitation from home.
          </p>

          {/* Pricing Highlight Pill */}
          <div className="pt-2 inline-flex flex-col sm:flex-row items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-teal-200 shadow-sm">
            <span className="text-2xl sm:text-3xl font-extrabold text-teal-800">
              ₹{fee} <span className="text-sm font-medium text-slate-500">/ Online Consultation</span>
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="text-xs text-slate-600 font-medium">
              Payment via PhonePe • Paytm • Google Pay ({paymentNum})
            </span>
          </div>
        </div>

        {/* Important Clinical Notice Box */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 sm:p-6 text-amber-900 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-700 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-sm leading-relaxed">
              <h2 className="font-bold text-amber-950 text-base">Important Medical Notice</h2>
              <p>
                Online physiotherapy consultation is intended for assessment and professional guidance based on the information provided during the consultation. It may not be appropriate for every condition. In case of a medical emergency or symptoms requiring immediate physical examination, seek appropriate emergency medical care.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Core Consultation Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1: Detailed Assessment */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Detailed Assessment</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                The consultation allows the physiotherapist to thoroughly understand your reported symptoms, pain triggers, functional limitations, and posture patterns through systematic subjective and guided movement assessment.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  Pain level (0–10) & duration review
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  Functional posture screening
                </li>
              </ul>
            </div>
          </div>

          {/* Pillar 2: Video Consultation */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Video className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Video Consultation</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                The appointment takes place online in an interactive one-on-one video session. You will receive your dedicated consultation link once your appointment request is reviewed and confirmed by our clinic team.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  Live video interaction
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  No complex app download needed
                </li>
              </ul>
            </div>
          </div>

          {/* Pillar 3: Medical Reports */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Medical Reports</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Patients can optionally provide relevant MRI scans, X-rays, ultrasound reports, or clinical discharge notes (up to 5 files). The physiotherapist reviews these in conjunction with your active symptoms.
              </p>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  PDF, JPG, JPEG, PNG supported
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  Protected clinical handling
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Detailed Consultation Preparation Guide */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900">
            How to Prepare for Your Online Consultation
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-slate-900 block text-xs uppercase text-teal-700">
                1. Space & Lighting
              </span>
              <p className="text-xs">
                Position your device (phone or laptop) in a well-lit room where you can step back 4–6 feet so movement and posture can be observed clearly.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-slate-900 block text-xs uppercase text-teal-700">
                2. Comfortable Attire
              </span>
              <p className="text-xs">
                Wear comfortable, loose-fitting clothing that allows easy joint movement (shorts for knees/hips, sleeveless or loose t-shirt for shoulders/neck).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-slate-900 block text-xs uppercase text-teal-700">
                3. Past Medical Scans
              </span>
              <p className="text-xs">
                Have any prior MRI, X-ray, or doctor notes uploaded during booking or readily available to reference during the call.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-slate-900 block text-xs uppercase text-teal-700">
                4. Stable Internet Connection
              </span>
              <p className="text-xs">
                Connect via reliable Wi-Fi or 4G/5G data for uninterrupted video assessment and exercise demonstration.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-teal-800 to-teal-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white">Book Your Video Consultation</h3>
            <p className="text-xs sm:text-sm text-teal-100">
              Standard fee ₹{fee} • Morning, Afternoon & Evening slots available.
            </p>
          </div>
          <button
            onClick={() => onNavigate('appointments')}
            className="shrink-0 bg-white hover:bg-teal-50 text-teal-900 font-bold text-sm px-6 py-3.5 rounded-xl shadow-sm transition-transform active:scale-95"
          >
            Start Booking Now
          </button>
        </div>

      </div>
    </div>
  );
};
