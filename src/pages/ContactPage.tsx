import React, { useState } from 'react';
import { 
  Phone, 
  MessageSquare, 
  Clock, 
  CreditCard, 
  Activity, 
  ShieldCheck, 
  CalendarCheck,
  AlertTriangle,
  Mail,
  MapPin,
  Send,
  CheckCircle2
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { Helmet } from 'react-helmet-async';
import { getCanonicalUrl, getOgImageUrl } from '../utils/seoHelper';

export const ContactPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { settings, whatsappUrl } = useClinic();
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const phone = settings.phone_number || '9875138912';
  const email = settings.email_address || 'consult@kivaphysio.com';
  const fee = settings.consultation_fee || '500';
  const paymentNum = settings.payment_number || '9875138912';
  const paymentMethods = settings.payment_methods || 'PhonePe, Paytm, Google Pay';
  const openingHours = settings.opening_hours || 'Monday – Saturday: 9:00 AM – 8:00 PM';
  const address = settings.address || 'Tele-Rehabilitation & Online Virtual Clinic';

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryMsg.trim()) return;

    // Compose prefilled WhatsApp message
    const cleanNumber = phone.replace(/\D/g, '');
    const finalNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;
    const text = `Hello Kiva Physiotherapy Clinic,\nMy Name: ${inquiryName}\nPhone: ${inquiryPhone || 'Not provided'}\nInquiry: ${inquiryMsg}`;
    window.open(`https://wa.me/${finalNumber}?text=${encodeURIComponent(text)}`, '_blank');
    setSentSuccess(true);
  };

  const canonicalUrl = getCanonicalUrl('/contact');
  const ogImageUrl = getOgImageUrl('/kiva-logo.svg');
  const pageTitle = "Contact Kiva Physiotherapy Clinic | Phone, WhatsApp & Support";
  const pageDescription = "Contact Kiva Physiotherapy Clinic via direct phone, WhatsApp (9875138912), or email. Available for appointment inquiries and payment verification.";

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="contact physiotherapy clinic, Kiva clinic phone number, WhatsApp physiotherapist consultation, online physio helpline" />
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

        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact Kiva Physiotherapy Clinic',
            url: canonicalUrl,
            mainEntity: {
              '@type': 'MedicalBusiness',
              name: 'Kiva Physiotherapy Clinic',
              telephone: `+91${phone.replace(/\D/g, '')}`,
              email: email,
              url: canonicalUrl,
            },
          })}
        </script>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-teal-100/90 text-teal-900 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-teal-200 shadow-xs">
            <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-teal-600/30">
              <img src="/kiva-logo.svg" alt="Kiva Logo" className="w-full h-full object-contain" />
            </div>
            <span>Kiva Clinic Contact Channels</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact Kiva Physiotherapy Clinic
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Reach out directly for consultation scheduling, technical assistance, or appointment status queries.
          </p>
        </div>

        {/* 3 Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: WhatsApp & Phone */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Direct Phone & WhatsApp</h2>
                <p className="text-xs text-slate-500 mt-0.5">Primary clinic contact channel</p>
              </div>
              <div className="pt-2">
                <a
                  href={`tel:${phone}`}
                  className="text-2xl font-bold font-mono text-teal-700 hover:text-teal-800 block"
                >
                  {phone}
                </a>
                <span className="text-xs text-slate-500 mt-1 block">
                  Available for calls & WhatsApp
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2.5 rounded-xl hover:bg-emerald-100 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Open WhatsApp Chat</span>
              </a>
            </div>
          </div>

          {/* Card 2: Consultation Periods */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Operating Hours</h2>
                <p className="text-xs text-slate-500 mt-0.5">{openingHours}</p>
              </div>
              <div className="space-y-2 text-xs text-slate-600 pt-1">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold">Morning Slot:</span>
                  <span>9:00 AM – 1:00 PM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold">Afternoon Slot:</span>
                  <span>1:00 PM – 5:00 PM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold">Evening Slot:</span>
                  <span>5:00 PM – 9:00 PM</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              * Dedicated video appointment confirmed upon review.
            </p>
          </div>

          {/* Card 3: Payments */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Payment Channel</h2>
                <p className="text-xs text-slate-500 mt-0.5">Consultation fee: ₹{fee}</p>
              </div>
              <div className="text-xs space-y-1.5 text-slate-600 pt-1">
                <span className="block font-semibold text-slate-800">Supported Methods:</span>
                <p>{paymentMethods}</p>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900 font-bold">
                  UPI / Phone: {paymentNum}
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              Please share payment screenshot in the booking form.
            </p>
          </div>

        </div>

        {/* Quick Message Box */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              Send a Direct Clinic Message
            </h3>
            <p className="text-xs text-slate-500">
              Have a question before booking? Type your inquiry below to connect with our clinical desk on WhatsApp.
            </p>
          </div>

          {sentSuccess ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>WhatsApp chat opened! Our clinic team will respond shortly.</span>
            </div>
          ) : (
            <form onSubmit={handleSendInquiry} className="space-y-3 max-w-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Name *"
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="Your Phone (Optional)"
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <textarea
                required
                rows={3}
                placeholder="What condition or question would you like to inquire about? *"
                value={inquiryMsg}
                onChange={(e) => setInquiryMsg(e.target.value)}
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              ></textarea>
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send via WhatsApp</span>
              </button>
            </form>
          )}
        </div>

        {/* Emergency Notice */}
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block mb-0.5 text-sm">Urgent Medical Notice:</strong>
            Online physiotherapy consultation is intended for assessment and professional guidance based on the information provided during the consultation. In case of a medical emergency or symptoms requiring immediate physical examination, seek appropriate emergency medical care.
          </div>
        </div>

        {/* Direct Booking CTA */}
        <div className="text-center pt-2">
          <button
            onClick={() => onNavigate('appointments')}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all"
          >
            <CalendarCheck className="w-5 h-5" />
            <span>Book Online Consultation (₹{fee})</span>
          </button>
        </div>

      </div>
    </div>
  );
};
