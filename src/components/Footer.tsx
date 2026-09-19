import React from 'react';
import { 
  Activity, 
  Phone, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink,
  Mail,
  MapPin,
  Clock
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useClinic();

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clinicName = settings.clinic_name || 'Kiva Physiotherapy Clinic';
  const phone = settings.phone_number || '9875138912';
  const email = settings.email_address || 'consult@kivaphysio.com';
  const fee = settings.consultation_fee || '500';
  const paymentNum = settings.payment_number || '9875138912';
  const paymentMethods = settings.payment_methods || 'PhonePe, Paytm, Google Pay';
  const openingHours = settings.opening_hours || 'Monday – Saturday: 9:00 AM – 8:00 PM';
  const address = settings.address || 'Tele-Rehabilitation & Online Virtual Clinic';

  const hasInstagram = Boolean(settings.social_instagram && settings.social_instagram.trim());
  const hasFacebook = Boolean(settings.social_facebook && settings.social_facebook.trim());
  const hasYoutube = Boolean(settings.social_youtube && settings.social_youtube.trim());
  const hasAnySocial = hasInstagram || hasFacebook || hasYoutube;

  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-16 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Requirement 19: Final Pre-Footer CTA */}
        <div className="mb-12 rounded-2xl bg-gradient-to-r from-teal-900/90 via-slate-900 to-slate-900 border border-teal-800/50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Ready to Book Your Consultation?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Personalized functional movement assessment & tailored recovery plan with our lead physiotherapist.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              id="footer-final-book-cta"
              onClick={() => handleNavClick('appointments')}
              className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md shadow-teal-950/40 transition-all hover:-translate-y-0.5"
            >
              <span>Book Appointment</span>
            </button>
          </div>
        </div>

        {/* Medical Disclaimer Banner */}
        <div className="mb-12 bg-slate-900/90 border border-slate-800 rounded-xl p-5 sm:p-6 text-slate-300 shadow-sm">
          <div className="flex items-start gap-3.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm leading-relaxed">
              <span className="font-bold text-white block mb-1 text-xs uppercase tracking-wider">
                Medical Disclaimer
              </span>
              Online physiotherapy consultation is intended for assessment and professional guidance based on the information provided during the consultation. It may not be appropriate for every condition. In case of a medical emergency or symptoms requiring immediate physical examination, seek appropriate emergency medical care.
            </div>
          </div>
        </div>

        {/* 4-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Clinic Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              {/* Official circular emblem logo: never stretches or distorts */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden aspect-square shrink-0 bg-white border-2 border-teal-500/40 shadow-lg shadow-teal-950/50">
                <img
                  src="/kiva-logo.svg"
                  alt="Kiva Physiotherapy Clinic Emblem Logo"
                  className="w-full h-full object-contain aspect-square block"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0">
                <span className="block text-lg sm:text-xl font-extrabold text-white tracking-tight leading-tight">
                  {clinicName}
                </span>
                <span className="block text-xs text-emerald-400 font-semibold mt-0.5">
                  Dr. Naresh (PT) • Physiotherapy Clinic
                </span>
                <span className="block text-[11px] text-slate-400 font-medium">
                  {settings.tagline || 'Move Better. Feel Better. Live Better.'}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              Delivering high-definition video physiotherapy assessments, movement evaluations, and structured recovery plans for neck, back, knee, shoulder, and sports conditions.
            </p>

            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs text-teal-300 font-semibold bg-teal-950/90 border border-teal-800/60 px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                Standard Consultation Fee: ₹{fee}
              </span>
            </div>

            {hasAnySocial && (
              <div className="pt-2">
                <span className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Connect With Us</span>
                <div className="flex items-center gap-3">
                  {hasInstagram && (
                    <a
                      href={settings.social_instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-pink-400 text-xs flex items-center gap-1 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800"
                    >
                      <span>Instagram</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {hasFacebook && (
                    <a
                      href={settings.social_facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-blue-400 text-xs flex items-center gap-1 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800"
                    >
                      <span>Facebook</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {hasYoutube && (
                    <a
                      href={settings.social_youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-red-400 text-xs flex items-center gap-1 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800"
                    >
                      <span>YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button onClick={() => handleNavClick('home')} className="hover:text-teal-400 transition-colors text-left">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('about')} className="hover:text-teal-400 transition-colors text-left">
                  About Clinic & Therapist
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('services')} className="hover:text-teal-400 transition-colors text-left">
                  Physiotherapy Services
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('online-consultation')} className="hover:text-teal-400 transition-colors text-left">
                  Online Consultation Details
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('gallery')} className="hover:text-teal-400 transition-colors text-left">
                  Clinic & Facility Gallery
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('reviews')} className="hover:text-teal-400 transition-colors text-left">
                  Patient Reviews & Stories
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('faq')} className="hover:text-teal-400 transition-colors text-left">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('contact')} className="hover:text-teal-400 transition-colors text-left">
                  Contact Clinic
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Patient Trust */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Legal & Policies
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button onClick={() => handleNavClick('privacy-policy')} className="hover:text-teal-400 transition-colors text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('terms')} className="hover:text-teal-400 transition-colors text-left">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('disclaimer')} className="hover:text-teal-400 transition-colors text-left">
                  Medical Disclaimer
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => handleNavClick('booking-status')}
                  className="text-teal-400 hover:text-teal-300 transition-colors font-medium text-left flex items-center gap-1"
                >
                  <span>→ Track Appointment Status</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('appointments')}
                  className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium text-left flex items-center gap-1"
                >
                  <span>→ Book Online Consultation</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Payment Info */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Contact & Payment
            </h4>
            <div className="space-y-3.5 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0 mt-1" />
                <div>
                  <span className="block text-xs text-slate-500 uppercase">Direct Phone / WhatsApp</span>
                  <a href={`tel:${phone}`} className="text-white hover:text-teal-400 font-semibold text-base">
                    {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0 mt-1" />
                <div>
                  <span className="block text-xs text-slate-500 uppercase">Email</span>
                  <a href={`mailto:${email}`} className="text-slate-300 hover:text-white text-xs break-all">
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-teal-400 shrink-0 mt-1" />
                <div>
                  <span className="block text-xs text-slate-500 uppercase">Operating Hours</span>
                  <span className="text-slate-300 text-xs">{openingHours}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="block text-xs text-slate-500 uppercase mb-1">Fee & Payment Modes</span>
                <p className="text-slate-300 text-xs font-medium">
                  {paymentMethods}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">
                  Payment Number: <span className="font-mono text-teal-300 font-semibold">{paymentNum}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & admin bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {clinicName}. All rights reserved.
          </div>
          <div className="flex items-center gap-5">
            <button onClick={() => handleNavClick('privacy-policy')} className="hover:text-slate-400 transition-colors">
              Privacy
            </button>
            <button onClick={() => handleNavClick('terms')} className="hover:text-slate-400 transition-colors">
              Terms
            </button>
            <button onClick={() => handleNavClick('disclaimer')} className="hover:text-slate-400 transition-colors">
              Disclaimer
            </button>
            <button onClick={() => handleNavClick('admin')} className="text-slate-400 hover:text-teal-400 transition-colors font-medium">
              Admin Portal
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
