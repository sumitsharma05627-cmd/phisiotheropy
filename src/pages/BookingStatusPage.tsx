import React, { useState } from 'react';
import { 
  Search, 
  CalendarCheck, 
  Clock, 
  Video, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { PatientStatusResult } from '../types';
import { Helmet } from 'react-helmet-async';
import { getCanonicalUrl, getOgImageUrl } from '../utils/seoHelper';

interface BookingStatusPageProps {
  onNavigate: (page: string) => void;
}

export const BookingStatusPage: React.FC<BookingStatusPageProps> = ({ onNavigate }) => {
  const [appointmentId, setAppointmentId] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PatientStatusResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentId.trim() || !identifier.trim()) {
      setErrorMsg('Please enter both your Appointment ID and Phone Number or Email.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const query = new URLSearchParams({
        appointmentId: appointmentId.trim(),
        identifier: identifier.trim(),
      });

      const response = await fetch(`/api/appointments/status?${query.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to find appointment record.');
      }

      setResult(data);
    } catch (err: any) {
      console.error('Status lookup error:', err);
      setErrorMsg(err.message || 'No matching appointment found with the provided details.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-3 py-1 rounded-full text-xs">Confirmed</span>;
      case 'PAYMENT VERIFICATION':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-3 py-1 rounded-full text-xs">Payment Verification</span>;
      case 'RESCHEDULED':
        return <span className="bg-indigo-100 text-indigo-900 border border-indigo-300 font-bold px-3 py-1 rounded-full text-xs">Rescheduled</span>;
      case 'COMPLETED':
        return <span className="bg-slate-200 text-slate-900 border border-slate-300 font-bold px-3 py-1 rounded-full text-xs">Completed</span>;
      case 'CANCELLED':
        return <span className="bg-rose-100 text-rose-900 border border-rose-300 font-bold px-3 py-1 rounded-full text-xs">Cancelled</span>;
      default:
        return <span className="bg-blue-100 text-blue-900 border border-blue-300 font-bold px-3 py-1 rounded-full text-xs">New Request</span>;
    }
  };

  const canonicalUrl = getCanonicalUrl('/booking-status');
  const ogImageUrl = getOgImageUrl('/kiva-logo.svg');
  const pageTitle = "Check Appointment Status | Kiva Physiotherapy Clinic";
  const pageDescription = "Track your online physiotherapy appointment, payment confirmation, and video consultation link using your appointment ID or phone number.";

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-teal-100/90 text-teal-900 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-teal-200 shadow-xs">
            <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-teal-600/30">
              <img src="/kiva-logo.svg" alt="Kiva Logo" className="w-full h-full object-contain" />
            </div>
            <span>Kiva Patient Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Check Appointment Status
          </h1>
          <p className="text-sm text-slate-600">
            Enter your Appointment ID and registered Phone Number or Email to view your consultation details.
          </p>
        </div>

        {/* Lookup Form */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <form onSubmit={handleLookup} className="space-y-4">
            
            <div className="space-y-1.5">
              <label htmlFor="lookup-appt-id" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Appointment ID <span className="text-rose-500">*</span>
              </label>
              <input
                id="lookup-appt-id"
                type="text"
                required
                placeholder="e.g. KIVA-2026-1001"
                value={appointmentId}
                onChange={(e) => setAppointmentId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 uppercase"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="lookup-identifier" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Phone Number or Email <span className="text-rose-500">*</span>
              </label>
              <input
                id="lookup-identifier"
                type="text"
                required
                placeholder="e.g. 9875138912 or patient@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              id="lookup-submit-btn"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm text-sm"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Checking Records...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Appointment</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Result Card */}
        {result && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-200 shadow-md space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-500 font-semibold block uppercase">Appointment Status</span>
                <span className="font-mono text-base font-bold text-slate-900">{result.appointmentId}</span>
              </div>
              <div>{getStatusBadge(result.appointmentStatus)}</div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Patient:</span>
                <span className="font-semibold text-slate-900">{result.patientNameMasked}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Request Received:</span>
                <span className="font-medium text-slate-800">
                  {new Date(result.requestReceivedAt).toLocaleDateString()} at{' '}
                  {new Date(result.requestReceivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Preferred Window:</span>
                <span className="font-medium text-slate-800">{result.preferredTime} Slot</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Payment Status:</span>
                <span className="font-semibold text-teal-800">
                  {result.paymentStatus === 'VERIFIED' ? 'Verified (₹500)' : 'Pending Verification'}
                </span>
              </div>
            </div>

            {/* Confirmed Appointment Details */}
            {result.appointmentStatus === 'CONFIRMED' && (
              <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 space-y-4">
                <div className="flex items-center gap-2 text-teal-950 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  <span>Consultation Confirmed</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-teal-100">
                    <span className="text-slate-500 block">Confirmed Date:</span>
                    <strong className="text-sm text-slate-900">{result.confirmedDate || 'To be announced'}</strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-teal-100">
                    <span className="text-slate-500 block">Confirmed Time:</span>
                    <strong className="text-sm text-slate-900">{result.confirmedTime || 'To be announced'}</strong>
                  </div>
                </div>

                {result.videoLink && (
                  <div className="pt-2">
                    <a
                      href={result.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors shadow-sm"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join Video Consultation</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Pending Notice */}
            {result.appointmentStatus !== 'CONFIRMED' && result.appointmentStatus !== 'CANCELLED' && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Awaiting Clinic Confirmation:</strong> Our physiotherapist is reviewing your submitted details and payment proof. You will receive WhatsApp/email notification once your slot is confirmed.
                </div>
              </div>
            )}

            {/* Contact Option */}
            <div className="pt-2">
              <a
                href="https://wa.me/919875138912?text=Hello%20Kiva%20Physiotherapy%20Clinic%2C%20I%20have%20an%20inquiry%20regarding%20my%20appointment%20status."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Clinic on WhatsApp (9875138912)</span>
              </a>
            </div>

          </div>
        )}

        {/* Privacy Note */}
        <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          <span>Detailed medical notes are kept strictly confidential and not shown publicly.</span>
        </div>

      </div>
    </div>
  );
};
