import React, { useState } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  CalendarCheck, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  HelpCircle,
  Clock,
  UserCheck,
  ChevronRight
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { Helmet } from 'react-helmet-async';
import { getCanonicalUrl, getOgImageUrl } from '../utils/seoHelper';
import { ClinicService } from '../types';
import { buildServicesListSchema } from '../utils/seoSchemas';

interface ServicesPageProps {
  onNavigate: (page: string, params?: { reason?: string }) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const { services, settings, whatsappUrl } = useClinic();
  const [selectedService, setSelectedService] = useState<ClinicService | null>(null);

  const consultationFee = settings.consultation_fee || '500';

  // Fallback default services if database is still loading
  const displayServices = services.length > 0 ? services : [
    {
      id: 1,
      name: 'Back and Neck Pain Management',
      short_description: 'Targeted assessment and rehabilitation for lumbar strain, cervical stiffness, sciatica symptoms, and postural fatigue.',
      full_description: 'Comprehensive mechanical spine evaluation to identify aggravating movements, postural triggers, and muscle imbalances. Includes customized core and spinal stability exercises, ergonomic adjustments, and symptom-relief strategies.',
      icon_name: 'Activity',
      image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
      display_order: 1
    },
    {
      id: 2,
      name: 'Joint and Knee Rehabilitation',
      short_description: 'Focused functional restoration for knee discomfort, osteoarthritis, patellar tracking, and hip or shoulder stiffness.',
      full_description: 'Evidence-informed protocols focused on lower-limb alignment, quadriceps and hamstring balancing, joint mobility preservation, and low-impact functional loading to reduce pain during daily walking, stairs, and exercise.',
      icon_name: 'Activity',
      image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      display_order: 2
    },
    {
      id: 3,
      name: 'Post-Surgical Rehabilitation',
      short_description: 'Step-by-step guidance following orthopedic procedures, arthroscopies, ligament repairs, and fracture recoveries.',
      full_description: 'Phase-appropriate recovery plans adhering strictly to surgical contraindications. We guide gentle range-of-motion progressions, swelling control advice, safe weight-bearing transitions, and progressive tissue loading.',
      icon_name: 'Activity',
      image_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      display_order: 3
    },
    {
      id: 4,
      name: 'Postural & Ergonomic Correction',
      short_description: 'Ergonomic optimization for desk professionals suffering from tech neck, upper back tightness, and repetitive strain.',
      full_description: 'Personalized workstation analysis, neck and scapular strengthening routines, dynamic stretch breaks, and postural habits to prevent chronic muscle fatigue during long hours of computer or smartphone use.',
      icon_name: 'Activity',
      image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      display_order: 4
    },
    {
      id: 5,
      name: 'Sports Injury Recovery',
      short_description: 'Rehabilitation programs for sprains, muscle strains, tendon irritation, and return-to-activity progression.',
      full_description: 'Functional recovery programs tailored for recreational runners, athletes, and fitness enthusiasts. Focuses on eccentric strengthening, proprioception retraining, and gradual return-to-sport protocols.',
      icon_name: 'Activity',
      image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      display_order: 5
    },
    {
      id: 6,
      name: 'Geriatric Mobility & Strength',
      short_description: 'Safe, low-impact exercise plans designed to preserve balance, joint mobility, independent movement, and confidence.',
      full_description: 'Gentle, home-friendly routines addressing age-related joint stiffness, balance hesitation, and muscle weakness. Focuses on safe functional transitions (sit-to-stand, walking security) and fall risk reduction.',
      icon_name: 'Activity',
      image_url: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=800&q=80',
      display_order: 6
    }
  ];

  const handleBookService = (serviceName: string) => {
    onNavigate('appointments', { reason: serviceName });
  };

  const canonicalUrl = getCanonicalUrl('/services');
  const ogImageUrl = getOgImageUrl('/kiva-logo.svg');
  const servicesSchema = buildServicesListSchema(displayServices);

  return (
    <div className="bg-slate-50 min-h-screen">
      <Helmet>
        <title>Physiotherapy Services & Treatments | Kiva Physiotherapy Clinic</title>
        <meta name="title" content="Physiotherapy Services & Treatments | Kiva Physiotherapy Clinic" />
        <meta 
          name="description" 
          content="Explore evidence-based physiotherapy services: back and neck pain management, joint and knee rehabilitation, post-surgical recovery, and sports injury rehab." 
        />
        <meta name="keywords" content="physiotherapy services, spine rehab, knee pain physiotherapy, sports injury rehabilitation, ergonomic posture correction, online physio sessions" />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Physiotherapy Services & Treatments | Kiva Physiotherapy Clinic" />
        <meta 
          property="og:description" 
          content="Explore evidence-based physiotherapy services: back and neck pain management, joint and knee rehabilitation, post-surgical recovery, and sports injury rehab." 
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Kiva Physiotherapy Clinic" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:alt" content="Physiotherapy Services - Kiva Physiotherapy Clinic" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Physiotherapy Services & Treatments | Kiva Physiotherapy Clinic" />
        <meta 
          name="twitter:description" 
          content="Explore evidence-based physiotherapy services: back and neck pain management, joint and knee rehabilitation, post-surgical recovery, and sports injury rehab." 
        />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:image:alt" content="Physiotherapy Services - Kiva Physiotherapy Clinic" />

        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(servicesSchema)}
        </script>
      </Helmet>

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-teal-900 via-teal-950 to-slate-900 text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-teal-800/60">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-teal-800/80 border border-teal-700 text-teal-200 text-xs font-semibold uppercase tracking-wider shadow-xs">
            <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-teal-500/40">
              <img src="/kiva-logo.svg" alt="Kiva Logo" className="w-full h-full object-contain" />
            </div>
            <span>Kiva Specialized Clinical Scope</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Physiotherapy Services & Rehabilitation
          </h1>

          <p className="text-base sm:text-lg text-teal-100/90 max-w-2xl mx-auto leading-relaxed">
            Evidence-informed physical therapy assessment, movement correction, and tailored exercise rehabilitation delivered through dedicated video consultations.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-teal-200">
            <span className="flex items-center gap-1.5 bg-teal-950/80 px-3 py-1.5 rounded-full border border-teal-800">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              Standard Fee: ₹{consultationFee}
            </span>
            <span className="flex items-center gap-1.5 bg-teal-950/80 px-3 py-1.5 rounded-full border border-teal-800">
              <Clock className="w-4 h-4 text-teal-400" />
              Comprehensive One-on-One Assessment
            </span>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayServices.map((service, index) => (
            <div
              key={service.id || index}
              id={`service-card-${service.id}`}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Optional Service Image */}
                {service.image_url ? (
                  <div className="h-48 w-full overflow-hidden bg-slate-100 relative">
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                    <span className="absolute bottom-3 left-4 text-xs font-bold text-white bg-teal-700/90 px-2.5 py-1 rounded-md">
                      Specialty {index + 1}
                    </span>
                  </div>
                ) : (
                  <div className="h-24 bg-gradient-to-r from-teal-800 to-teal-700 p-4 flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center">
                      <Activity className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-teal-200 bg-black/20 px-2.5 py-1 rounded-md">
                      Specialty {index + 1}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
                    {service.name}
                  </h3>
                  
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {service.short_description}
                  </p>

                  {service.full_description && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        Clinical Approach:
                      </span>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {service.full_description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 pt-0 border-t border-slate-100/80 bg-slate-50/50 mt-4 flex flex-col gap-2.5">
                <button
                  id={`book-service-btn-${service.id}`}
                  onClick={() => handleBookService(service.name)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm py-2.5 px-4 rounded-xl shadow-sm transition-colors"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Book for {service.name.split(' ')[0]}</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Clinical Assessment Framework info block */}
        <div className="mt-16 bg-white rounded-2xl border border-teal-200 p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Evidence-Based Methodology
              </span>
              <h2 className="text-2xl font-bold text-slate-900">
                What to Expect During Your Online Physiotherapy Consultation
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                During each session, we systematically review your pain history, perform guided active range-of-motion assessments, evaluate scans or medical reports you provide, and construct a progressive, step-by-step home exercise regimen.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Detailed mechanical & movement screening</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Clear explanation of contributing factors</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Targeted video-guided exercises tailored for you</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Ergonomic and daily activity modifications</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 justify-center items-center lg:items-end border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
              <div className="text-center lg:text-right">
                <span className="text-xs text-slate-500 block">Consultation Fee</span>
                <span className="text-3xl font-extrabold text-slate-900">₹{consultationFee}</span>
              </div>
              <button
                id="services-bottom-cta-btn"
                onClick={() => onNavigate('appointments')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Book Consultation</span>
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                Questions? Inquire on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
