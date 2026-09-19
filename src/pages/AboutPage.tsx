import React from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Video, 
  CheckCircle2, 
  ArrowRight,
  Heart,
  Award,
  BookOpen,
  MessageCircle,
  Camera,
  CalendarCheck
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { Helmet } from 'react-helmet-async';
import { getCanonicalUrl, getOgImageUrl } from '../utils/seoHelper';
import { buildDoctorPhysicianSchema } from '../utils/seoSchemas';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { settings, featuredGallery } = useClinic();

  const therapistName = settings.therapist_name || 'Lead Clinical Physiotherapist';
  const therapistQualification = settings.therapist_qualification || 'Bachelor / Master of Physiotherapy (PT)';
  const therapistExperience = settings.therapist_experience || 'Clinical Experience in Musculoskeletal & Postural Rehabilitation';
  const therapistSpecializations = settings.therapist_specializations || 'Spine Care, Knee & Joint Rehabilitation, Ergonomic Ergonomics';
  const therapistBio = settings.therapist_bio || 'Dedicated to conservative, movement-first rehabilitation. Focusing on functional testing, movement biomechanics, ergonomic coaching, and empowering patients with actionable home exercises.';
  const therapistPhoto = settings.therapist_photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80';

  const canonicalUrl = getCanonicalUrl('/about');
  const ogImageUrl = getOgImageUrl('/kiva-logo.svg');
  const doctorSchema = buildDoctorPhysicianSchema(settings);

  return (
    <div className="bg-slate-50 min-h-screen">
      <Helmet>
        <title>About Dr. Naresh & Kiva Physiotherapy Clinic | Clinical Approach</title>
        <meta name="title" content="About Dr. Naresh & Kiva Physiotherapy Clinic | Clinical Approach" />
        <meta 
          name="description" 
          content="Meet Dr. Naresh (PT) and learn about Kiva Physiotherapy Clinic's evidence-based clinical practice, movement assessment, and tele-rehabilitation." 
        />
        <meta name="keywords" content="Dr Naresh PT, physiotherapist profile, Kiva Physiotherapy Clinic team, evidence based physiotherapy, spine rehabilitation specialist, virtual care" />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="profile" />
        <meta property="og:title" content="About Dr. Naresh & Kiva Physiotherapy Clinic | Clinical Approach" />
        <meta 
          property="og:description" 
          content="Meet Dr. Naresh (PT) and learn about Kiva Physiotherapy Clinic's evidence-based clinical practice, movement assessment, and tele-rehabilitation." 
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Kiva Physiotherapy Clinic" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:alt" content="Dr. Naresh PT - Kiva Physiotherapy Clinic" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Dr. Naresh & Kiva Physiotherapy Clinic | Clinical Approach" />
        <meta 
          name="twitter:description" 
          content="Meet Dr. Naresh (PT) and learn about Kiva Physiotherapy Clinic's evidence-based clinical practice, movement assessment, and tele-rehabilitation." 
        />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:image:alt" content="Dr. Naresh PT - Kiva Physiotherapy Clinic" />

        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(doctorSchema)}
        </script>
      </Helmet>

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-teal-900 via-teal-950 to-slate-900 text-white pt-14 pb-16 px-4 sm:px-6 lg:px-8 border-b border-teal-800/60">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-teal-800/80 border border-teal-700 text-teal-200 text-xs font-semibold uppercase tracking-wider">
            <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-teal-500/40">
              <img src="/kiva-logo.svg" alt="Kiva Logo" className="w-full h-full object-contain" />
            </div>
            <span>About Kiva Physiotherapy Clinic</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Our Care Philosophy & Rehabilitation Mission
          </h1>

          <p className="text-base sm:text-lg text-teal-100/90 max-w-2xl mx-auto leading-relaxed">
            Committed to helping you move with less pain, regain physical independence, and sustain long-term joint health through guided exercise therapy.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Clinic Introduction */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block">
              Patient-Centered Practice
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
              Bridging Expert Clinical Assessment With Home Rehabilitation
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Kiva Physiotherapy Clinic was created to make structured, evidence-informed physiotherapy consultations straightforward and accessible. Whether addressing chronic lumbar stiffness from office desk work, managing knee osteoarthritis, or progressing safely after an orthopedic surgery, we focus on what matters most: your daily functional movement.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              We never believe in generic, one-size-fits-all sheets of exercises. Every consultation is conducted live via high-definition video, allowing dedicated time to observe your range of motion, understand your pain triggers, and formulate step-by-step guidance you can safely implement.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
                alt="Physiotherapy Clinic consultation"
                className="w-full h-80 object-cover"
              />
              <div className="p-4 bg-white">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
                  Virtual Clinic Standard
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Structured assessment, report correlation, and custom movement regimens.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Core Philosophies */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Our 4 Pillars
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              The Kiva Physiotherapy Philosophy
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Patient-Centered Care
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We design treatment around your lifestyle, work demands, and specific functional goals — listening attentively to your experience.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Evidence-Based Physiotherapy
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Applying validated mechanical evaluations, progressive active loading, and proven clinical exercise science.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Long-Term Recovery Focus
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rather than offering temporary passive fixes, we equip you with corrective movement routines that keep you resilient over time.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Clear Communication
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transparent answers, zero medical jargon, realistic recovery timelines, and straightforward ₹{settings.consultation_fee || '500'} pricing.
              </p>
            </div>
          </div>
        </section>

        {/* Meet the Physiotherapist Section */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="relative w-44 h-44 rounded-2xl overflow-hidden border-2 border-teal-600 shadow-md">
                <img
                  src={therapistPhoto}
                  alt={therapistName}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                Verified Practitioner
              </span>
            </div>

            <div className="md:col-span-8 space-y-3">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Consulting Practitioner
                </span>
                <h3 className="text-2xl font-bold text-slate-900">
                  {therapistName}
                </h3>
                <p className="text-sm font-semibold text-teal-800">
                  {therapistQualification}
                </p>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>{therapistBio}</p>
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-800 block">Experience Scope:</span>
                    <span className="text-slate-600">{therapistExperience}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-800 block">Focus Areas:</span>
                    <span className="text-slate-600">{therapistSpecializations}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => onNavigate('appointments')}
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-colors"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Book Consultation With {therapistName.split(' ')[0]}</span>
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* Clinic Facility Photos Snippet */}
        {featuredGallery.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block">
                  Inside Kiva Physiotherapy
                </span>
                <h2 className="text-2xl font-bold text-slate-900">
                  Clinic Environment & Equipment
                </h2>
              </div>
              <button
                onClick={() => onNavigate('gallery')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 hover:underline"
              >
                <span>View Full Photo Gallery</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {featuredGallery.slice(0, 3).map((img) => (
                <div 
                  key={img.id}
                  onClick={() => onNavigate('gallery')}
                  className="group relative rounded-xl overflow-hidden shadow-sm border border-slate-200 cursor-pointer h-52 bg-slate-100"
                >
                  <img
                    src={img.image_url}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-bold text-white truncate">
                      {img.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA Banner */}
        <section className="bg-gradient-to-r from-teal-800 to-teal-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white">Start Your Guided Recovery Today</h3>
            <p className="text-xs sm:text-sm text-teal-100">
              One-on-one video consultation, movement screening, and tailored exercises for ₹{settings.consultation_fee || '500'}.
            </p>
          </div>
          <button
            onClick={() => onNavigate('appointments')}
            className="shrink-0 bg-white hover:bg-teal-50 text-teal-900 font-bold text-sm px-6 py-3.5 rounded-xl shadow-sm transition-transform active:scale-95"
          >
            Book Appointment
          </button>
        </section>

      </div>
    </div>
  );
};
