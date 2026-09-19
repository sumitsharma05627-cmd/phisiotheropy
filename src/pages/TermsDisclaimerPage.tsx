import React from 'react';
import { AlertTriangle, ShieldCheck, FileCheck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { getCanonicalUrl, getOgImageUrl } from '../utils/seoHelper';

export const TermsDisclaimerPage: React.FC = () => {
  const canonicalUrl = getCanonicalUrl('/terms');
  const ogImageUrl = getOgImageUrl('/kiva-logo.svg');
  const pageTitle = "Terms of Service & Clinical Conditions | Kiva Physiotherapy Clinic";
  const pageDescription = "Review terms of service, tele-rehabilitation scope, cancellation policies, and patient responsibilities for Kiva Physiotherapy Clinic.";

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-semibold px-3 py-1 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            <span>Clinical Notice & Terms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms & Medical Disclaimer
          </h1>
          <p className="text-xs text-slate-500">
            Kiva Physiotherapy Clinic • Tele-Rehabilitation Service Guidelines
          </p>
        </div>

        {/* Highlight Box with Prompt's Mandatory Medical Disclaimer */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 text-amber-950 space-y-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0" />
            <h2 className="text-lg font-bold">Important Medical Disclaimer</h2>
          </div>
          <p className="text-sm leading-relaxed font-medium">
            "Online physiotherapy consultation is intended for assessment and professional guidance based on the information provided during the consultation. It may not be appropriate for every condition. In case of a medical emergency or symptoms requiring immediate physical examination, seek appropriate emergency medical care."
          </p>
        </div>

        {/* Full Terms */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8 text-sm text-slate-600 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">1. Nature of Tele-Consultation</h2>
            <p>
              Online physiotherapy involves virtual audiovisual observation, history taking, and remote movement evaluation. Because a physical hands-on examination is not possible through a screen, tele-consultation relies on the accuracy of the symptoms reported and demonstrated by the patient.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">2. Emergency Symptoms & Red Flags</h2>
            <p>
              If you experience sudden severe symptoms such as loss of bowel or bladder control, progressive numbness in the saddle region, severe chest pain, unremitting severe headaches, acute fractures, or trauma, do not wait for an online appointment. Seek emergency emergency medical attention at your nearest healthcare facility immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">3. Consultation Fee & Payments</h2>
            <p>
              The standard consultation fee is ₹500. Payments are made via PhonePe, Paytm, or Google Pay to the designated clinic number (9875138912). Appointment booking requests are confirmed upon administrative verification of the payment screenshot.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">4. Rescheduling and Cancellations</h2>
            <p>
              If you need to reschedule your confirmed video session, please inform the clinic via WhatsApp at 9875138912 at least 2 hours before your scheduled time. Our team will endeavor to arrange an alternative suitable slot.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">5. Patient Accuracy & Consent</h2>
            <p>
              By submitting an appointment request, you confirm that the health details and reports provided are accurate to the best of your knowledge and that you consent to participating in a remote video assessment.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};
