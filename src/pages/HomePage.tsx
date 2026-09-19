import React from 'react';
import { 
  CalendarCheck, 
  Video, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Activity,
  Search,
  MessageSquare,
  Sparkles,
  Stethoscope,
  HeartPulse,
  Award,
  Clock
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { Helmet } from 'react-helmet-async';
import { getCanonicalUrl, getOgImageUrl } from '../utils/seoHelper';
import { buildClinicOrganizationSchema } from '../utils/seoSchemas';

import { TrustCards } from '../components/home/TrustCards';
import { HowItWorksTimeline } from '../components/home/HowItWorksTimeline';
import { EducationalJourney } from '../components/home/EducationalJourney';
import { GalleryPreview } from '../components/home/GalleryPreview';
import { ReviewCarousel } from '../components/home/ReviewCarousel';
import { FaqAccordion } from '../components/home/FaqAccordion';

interface HomePageProps {
  onNavigate: (page: string, params?: { reason?: string }) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { settings, services, whatsappUrl } = useClinic();

  const consultationFee = settings.consultation_fee || '500';
  const phoneNumber = settings.phone_number || '9875138912';

  // Default conditions if services list is empty
  const displayServices = services && services.length > 0 ? services.slice(0, 6) : [
    { 
      id: 1, 
      name: 'Back and Neck Pain Management', 
      short_description: 'Targeted spine assessment and evidence-based relief strategies for disc, postural, and muscular stiffness.' 
    },
    { 
      id: 2, 
      name: 'Joint and Knee Rehabilitation', 
      short_description: 'Functional movement restoration for joint discomfort, osteoarthritis, and mobility preservation.' 
    },
    { 
      id: 3, 
      name: 'Post-Surgical Rehabilitation', 
      short_description: 'Progressive recovery guidance following orthopedic surgeries, arthroscopy, or joint procedures.' 
    },
    { 
      id: 4, 
      name: 'Postural & Ergonomic Correction', 
      short_description: 'Biomechanics evaluation and targeted muscle balancing for desk workers and remote professionals.' 
    },
    { 
      id: 5, 
      name: 'Sports Injury Recovery', 
      short_description: 'Structured rehabilitation for muscle strains, tendon recovery, and confident return to active movement.' 
    },
    { 
      id: 6, 
      name: 'Geriatric Mobility & Balance', 
      short_description: 'Safe, low-load functional movements to improve everyday balance, confidence, and joint health.' 
    },
  ];

  const canonicalUrl = getCanonicalUrl('/');
  const ogImageUrl = getOgImageUrl('/kiva-logo.svg');
  const orgSchema = buildClinicOrganizationSchema(settings);

  return (
    <div className="bg-slate-50 min-h-screen">
      <Helmet>
        <title>Kiva Physiotherapy Clinic – Online Consultation & Assessment</title>
        <meta name="title" content="Kiva Physiotherapy Clinic – Online Consultation & Assessment" />
        <meta 
          name="description" 
          content="Book an online physiotherapy consultation with Dr. Naresh (PT). Professional virtual movement assessment, reports review, and personalized exercise recovery." 
        />
        <meta name="keywords" content="online physiotherapy consultation, virtual physical therapy India, Dr Naresh PT, tele-rehabilitation, back pain exercise, knee rehab, Kiva clinic" />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Kiva Physiotherapy Clinic – Online Consultation & Assessment" />
        <meta 
          property="og:description" 
          content="Book an online physiotherapy consultation with Dr. Naresh (PT). Professional virtual movement assessment, reports review, and personalized exercise recovery." 
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Kiva Physiotherapy Clinic" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:alt" content="Kiva Physiotherapy Clinic" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kiva Physiotherapy Clinic – Online Consultation & Assessment" />
        <meta 
          name="twitter:description" 
          content="Book an online physiotherapy consultation with Dr. Naresh (PT). Professional virtual movement assessment, reports review, and personalized exercise recovery." 
        />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:image:alt" content="Kiva Physiotherapy Clinic" />

        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(orgSchema)}
        </script>
      </Helmet>

      {/* 1. ENGAGING HERO SECTION (Requirement 5) */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-24 border-b border-slate-200/80 bg-gradient-to-b from-teal-50/70 via-white to-slate-50">
        
        {/* Subtle Animated Background Elements (Soft gradient shapes & gentle floating icons) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-200/25 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-24 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl" />
          
          {/* Subtle floating medical shapes (respects prefers-reduced-motion via motion-safe) */}
          <div className="hidden md:block absolute top-20 left-12 text-teal-300/40 motion-safe:animate-pulse">
            <HeartPulse className="w-10 h-10" />
          </div>
          <div className="hidden md:block absolute bottom-16 left-1/3 text-emerald-300/30 motion-safe:animate-pulse">
            <Activity className="w-8 h-8" />
          </div>
          <div className="hidden lg:block absolute top-36 right-16 text-teal-400/30 motion-safe:animate-pulse">
            <Sparkles className="w-7 h-7" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Area */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Requirement 5: Small badge with official clinic logo */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-teal-100/90 border border-teal-200 text-teal-900 text-xs font-semibold tracking-wide shadow-xs">
                <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-teal-600/30">
                  <img src="/kiva-logo.svg" alt="Kiva Logo" className="w-full h-full object-contain" />
                </div>
                <span>Professional Physiotherapy Care</span>
              </div>

              {/* Requirement 5: Headline "Move Better. Recover Better. Live Better." */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                {settings.hero_headline || 'Move Better.\nRecover Better.\nLive Better.'}
              </h1>

              {/* Requirement 5: Supporting text */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                {settings.hero_description || 'Explore physiotherapy consultation options designed around your individual needs.'}
              </p>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white/90 border border-slate-200 px-2.5 sm:px-3 py-2 rounded-xl text-[11px] sm:text-xs font-semibold text-slate-800 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">Licensed PT</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white/90 border border-slate-200 px-2.5 sm:px-3 py-2 rounded-xl text-[11px] sm:text-xs font-semibold text-slate-800 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">Evidence-Based</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white/90 border border-slate-200 px-2.5 sm:px-3 py-2 rounded-xl text-[11px] sm:text-xs font-semibold text-slate-800 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">Custom Routine</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white/90 border border-slate-200 px-2.5 sm:px-3 py-2 rounded-xl text-[11px] sm:text-xs font-semibold text-slate-800 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">1-on-1 Attention</span>
                </div>
              </div>

              {/* Consultation Fee Callout Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-teal-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-xl">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                    Transparent Standard Consultation
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-baseline gap-1.5">
                    <span>₹{consultationFee}</span>
                    <span className="text-xs sm:text-sm font-medium text-slate-500">/ Session</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Includes movement observation, past report review & personalized routine.
                  </p>
                </div>
                <div className="flex flex-col sm:items-end gap-1 shrink-0">
                  <span className="text-[11px] font-medium text-slate-500">Payment Modes:</span>
                  <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                    GPay • PhonePe • Paytm
                  </span>
                </div>
              </div>

              {/* Requirement 5: Buttons: "Book Appointment" and "Explore Services" */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  id="hero-book-primary-btn"
                  onClick={() => onNavigate('appointments')}
                  className="inline-flex items-center justify-center gap-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-base px-7 py-3.5 rounded-xl shadow-md shadow-teal-600/20 transition-all hover:-translate-y-0.5"
                >
                  <CalendarCheck className="w-5 h-5" />
                  <span>Book Appointment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-explore-services-btn"
                  onClick={() => onNavigate('services')}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold text-base px-6 py-3.5 rounded-xl border border-slate-300 shadow-xs transition-all hover:border-teal-300 hover:text-teal-900"
                >
                  <span>Explore Services</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Status Helper Link */}
              <div className="flex items-center gap-3 pt-1 text-xs text-slate-500">
                <button
                  onClick={() => onNavigate('booking-status')}
                  className="inline-flex items-center gap-1.5 font-medium text-teal-700 hover:text-teal-800 underline underline-offset-4"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Already requested a booking? Track Appointment Status</span>
                </button>
              </div>

            </div>

            {/* Right Clinical Visual Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xl space-y-6 group">
                
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100">
                  <img
                    src={settings.hero_image_url || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80'}
                    alt="Physiotherapy Clinic consultation"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 block">
                      Live Video Tele-Rehab
                    </span>
                    <p className="text-sm font-bold text-white leading-tight">
                      One-on-one movement analysis & exercise prescription
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-bold text-slate-900 block">Morning & Evening</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">Flexible time slots</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-bold text-slate-900 block">Report Review</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">MRI & X-ray analysis</p>
                  </div>
                </div>

                <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-teal-900 block">Standard Fee: ₹{consultationFee}</span>
                    <span className="text-[11px] text-teal-700">No hidden charges</span>
                  </div>
                  <button
                    onClick={() => onNavigate('appointments')}
                    className="text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 px-3.5 py-2 rounded-lg transition-colors"
                  >
                    Select Slot
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. TRUST-BUILDING SECTION (Requirement 11) */}
      <TrustCards />

      {/* 3. INTERACTIVE SERVICE CARDS (Requirement 7) */}
      <section className="bg-slate-100/70 py-16 sm:py-20 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/90 text-teal-800 text-xs font-bold uppercase tracking-wider">
                Clinical Focus Areas
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Physiotherapy Services & Conditions
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Structured consultation and rehabilitation protocols for common musculoskeletal conditions.
              </p>
            </div>

            <button
              id="home-view-all-services-btn"
              onClick={() => onNavigate('services')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-800 hover:underline px-3.5 py-2 rounded-xl bg-white border border-slate-200 self-start sm:self-auto"
            >
              <span>View All Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Service Cards with Hover Zoom, Elevation, and Arrow Animation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayServices.map((serv) => (
              <div
                key={serv.id}
                className="group bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-teal-300 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div className="space-y-3.5">
                  <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300 shadow-xs">
                    <Activity className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-teal-900 transition-colors">
                    {serv.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {serv.short_description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate('appointments', { reason: serv.name })}
                    className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1.5 group-hover:underline"
                  >
                    <span>Book for this Condition</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => onNavigate('services')}
                    className="text-xs font-medium text-slate-500 hover:text-slate-800"
                  >
                    Learn More →
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. SMART CTA SECTION 1 (After Services - Requirement 15) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-3xl bg-gradient-to-r from-teal-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border border-teal-800/40">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Not sure which consultation is right for you?
            </h3>
            <p className="text-xs sm:text-sm text-teal-100/90 max-w-xl">
              Describe your symptoms directly to our clinic team over WhatsApp and we will guide you on the appropriate consultation slot.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <a
              id="cta-services-talk-btn"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-sm transition-transform active:scale-98"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Talk to Us</span>
            </a>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE HOW IT WORKS (Requirement 8) */}
      <HowItWorksTimeline onNavigate={onNavigate} />

      {/* 6. EDUCATIONAL JOURNEY SECTION (Requirement 16) */}
      <EducationalJourney />

      {/* 7. INTERACTIVE PHOTO GALLERY (Requirement 10) */}
      <GalleryPreview onNavigate={onNavigate} />

      {/* 8. SMART CTA SECTION 2 (After Gallery - Requirement 15) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="rounded-3xl bg-teal-50 border border-teal-200/80 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-teal-950">
              Want to Know More About Our Consultation?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Learn how our video movement assessment works or reserve a scheduled time slot directly.
            </p>
          </div>
          <div className="shrink-0">
            <button
              id="cta-gallery-book-btn"
              onClick={() => onNavigate('appointments')}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-xs transition-transform active:scale-98"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </section>

      {/* 9. REVIEW CAROUSEL (Requirement 9) */}
      <ReviewCarousel onNavigate={onNavigate} />

      {/* 10. SMART CTA SECTION 3 (After Reviews - Requirement 15) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block">
              Take Action For Your Mobility
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Ready to Take the Next Step?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Schedule your 1-on-1 functional evaluation session and get clear, personalized recovery direction.
            </p>
          </div>
          <div className="shrink-0">
            <button
              id="cta-reviews-book-btn"
              onClick={() => onNavigate('appointments')}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-sm transition-all hover:-translate-y-0.5"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Your Consultation</span>
            </button>
          </div>
        </div>
      </section>

      {/* 11. INTERACTIVE FAQ (Requirement 12) */}
      <FaqAccordion onNavigate={onNavigate} />

    </div>
  );
};
