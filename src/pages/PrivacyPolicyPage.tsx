import React from 'react';
import { ShieldCheck, Lock, FileText } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { getCanonicalUrl, getOgImageUrl } from '../utils/seoHelper';

export const PrivacyPolicyPage: React.FC = () => {
  const canonicalUrl = getCanonicalUrl('/privacy');
  const ogImageUrl = getOgImageUrl('/kiva-logo.svg');
  const pageTitle = "Privacy Policy & Medical Data Protection | Kiva Physiotherapy Clinic";
  const pageDescription = "Read Kiva Physiotherapy Clinic's commitment to patient data privacy, confidential report storage, and telemedicine compliance.";

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
          <div className="inline-flex items-center gap-1.5 bg-teal-100 text-teal-900 text-xs font-semibold px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
            <span>Data Protection & Confidentiality</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500">
            Last Updated: September 2026 • Kiva Physiotherapy Clinic
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8 text-sm text-slate-600 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Commitment to Patient Privacy</h2>
            <p>
              At <strong>Kiva Physiotherapy Clinic</strong>, we take the confidentiality of your health data, contact details, and uploaded medical reports with the highest seriousness. This policy describes how we collect, store, and utilize information provided through our online consultation booking platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. Information We Collect</h2>
            <p>When you book an online physiotherapy consultation, we collect:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li><strong>Personal Identification Details:</strong> Full Name, Age, Gender, City, and Country.</li>
              <li><strong>Contact Information:</strong> WhatsApp / Phone Number, Email Address.</li>
              <li><strong>Clinical Information:</strong> Reported problem description, onset duration, and pain severity level (0–10).</li>
              <li><strong>Medical Documents:</strong> Relevant MRI scans, X-rays, or prior clinical reports that you optionally upload.</li>
              <li><strong>Payment Verification Details:</strong> Payment transaction confirmation screenshot and UPI payment reference.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. How Your Information Is Used</h2>
            <p>All collected information is used exclusively for:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>Clinical preparation, musculoskeletal assessment, and video consultation scheduling.</li>
              <li>Communicating consultation appointments, dates, times, and video session links via WhatsApp or email.</li>
              <li>Verifying payment received for the ₹500 standard consultation fee.</li>
            </ul>
            <p>
              We do <strong>not</strong> sell, rent, monetize, or disclose your clinical or personal records to any third-party marketing companies or advertising networks.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Secure File Handling & Storage</h2>
            <p>
              Medical reports and payment receipts uploaded to our system are stored in private, protected server directories outside of public web roots. Files cannot be accessed through guessable public URLs and are strictly restricted to authorized clinic staff through authenticated administrative controls.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">5. Contact Regarding Privacy</h2>
            <p>
              If you have any questions about how your data is handled or wish to request deletion of your consultation files after completion of care, please contact our clinic team directly on Phone / WhatsApp at <strong>9875138912</strong>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};
