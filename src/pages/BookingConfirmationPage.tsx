import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MessageSquare, 
  Home, 
  ShieldCheck, 
  Copy, 
  FileText,
  Search
} from 'lucide-react';
import { BookingSubmissionResponse } from '../types';
import { Helmet } from 'react-helmet-async';
import { getCanonicalUrl, getOgImageUrl } from '../utils/seoHelper';

interface BookingConfirmationPageProps {
  bookingData: BookingSubmissionResponse;
  onNavigate: (page: string) => void;
}

export const BookingConfirmationPage: React.FC<BookingConfirmationPageProps> = ({
  bookingData,
  onNavigate,
}) => {
  const [copiedId, setCopiedId] = React.useState(false);

  const copyAppointmentId = () => {
    navigator.clipboard.writeText(bookingData.appointmentId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Kiva Physiotherapy Clinic, I have submitted an online consultation request with ID ${bookingData.appointmentId}. Please verify my payment and confirm my consultation time.`
  );
  const whatsappUrl = `https://wa.me/919875138912?text=${whatsappMessage}`;

  const canonicalUrl = getCanonicalUrl('/booking-confirmation');
  const ogImageUrl = getOgImageUrl('/kiva-logo.svg');
  const pageTitle = "Consultation Request Confirmed | Kiva Physiotherapy Clinic";
  const pageDescription = "Your online physiotherapy consultation request has been received. Please verify payment via WhatsApp to confirm your slot.";

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-20">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="noindex, nofollow" />

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
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl space-y-8 text-center">
          
          {/* Clinic Logo & Success Indicator */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full overflow-hidden aspect-square shrink-0 border-2 border-teal-600/30 shadow-md">
              <img
                src="/kiva-logo.svg"
                alt="Kiva Physiotherapy Clinic Logo"
                className="w-full h-full object-contain aspect-square block"
              />
            </div>
            <div className="w-12 h-12 bg-teal-50 border-2 border-teal-200 rounded-full flex items-center justify-center text-teal-600 shadow-xs -mt-6 z-10 bg-white">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <span className="inline-block bg-teal-100/80 text-teal-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Status: Payment Verification Pending
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Appointment Request Received
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Thank you, <strong className="text-slate-900">{bookingData.patientName}</strong>. Your online physiotherapy consultation request has been submitted.
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200/80 text-left space-y-4">
            
            {/* Request ID */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Appointment Request ID
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm sm:text-base font-bold text-teal-900 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                  {bookingData.appointmentId}
                </span>
                <button
                  onClick={copyAppointmentId}
                  title="Copy Appointment ID"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Selected Period */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Selected Consultation Period
              </span>
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-600" />
                {bookingData.preferredTime} Slot
              </span>
            </div>

            {/* Payment Status */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Payment Status
              </span>
              <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-full border border-amber-200">
                Verification Pending (₹500)
              </span>
            </div>

            {/* Notice */}
            <div className="pt-2 text-xs text-slate-600 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-1">What Happens Next:</strong>
              Our team will review your request, verify the uploaded payment screenshot, and confirm your exact consultation date, time, and video link.
            </div>

          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <a
              id="confirm-whatsapp-btn"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Contact on WhatsApp (9875138912)</span>
            </a>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => onNavigate('status')}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-xl text-sm transition-colors"
              >
                <Search className="w-4 h-4 text-teal-700" />
                <span>Track Booking Status</span>
              </button>

              <button
                onClick={() => onNavigate('home')}
                className="w-full flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-xl text-sm transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Kiva Physiotherapy Clinic • Confidential Health Data Handling</span>
          </div>

        </div>

      </div>
    </div>
  );
};
