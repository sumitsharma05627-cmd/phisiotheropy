import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  MessageSquare, 
  ShieldCheck, 
  CreditCard, 
  Video, 
  FileText,
  Search,
  CalendarCheck
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { Helmet } from 'react-helmet-async';
import { getCanonicalUrl, getOgImageUrl } from '../utils/seoHelper';
import { buildFaqSchema } from '../utils/seoSchemas';

export const FaqPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { faqs: cmsFaqs, settings, whatsappUrl } = useClinic();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const defaultFaqs = [
    {
      id: 1,
      category: 'Consultation & Scope',
      question: 'How does an online physiotherapy consultation work?',
      answer: 'An online consultation begins by submitting your reported symptoms, duration of problem, and pain level (0–10) through our booking form. You can also upload any relevant MRI, X-ray, or medical reports. Once payment is verified, our team will confirm your consultation slot and share a private video link for your session.',
      display_order: 1
    },
    {
      id: 2,
      category: 'Pricing & Fee',
      question: 'What is the consultation fee and what is included?',
      answer: `The standard fee for an online physiotherapy consultation is ₹${settings.consultation_fee || '500'}. This includes a detailed functional assessment, subjective symptom review, evaluation of available medical reports, live movement testing, and a personalized exercise and ergonomic recovery plan.`,
      display_order: 2
    },
    {
      id: 3,
      category: 'Emergency & Triage',
      question: 'What if online consultation is not suitable for my condition?',
      answer: 'Online physiotherapy is well-suited for many musculoskeletal discomforts, postural issues, and recovery guidance. However, if symptoms suggest red flags, sudden progressive neurological deficit, acute trauma, or severe symptoms requiring immediate physical examination, we will promptly advise you to seek local emergency medical care or hospital examination.',
      display_order: 3
    },
    {
      id: 4,
      category: 'Payment & Verification',
      question: 'Which payment methods are accepted?',
      answer: `Payments can be completed via ${settings.payment_methods || 'PhonePe, Paytm, or Google Pay'} using the clinic payment number: ${settings.payment_number || '9875138912'}. After paying ₹${settings.consultation_fee || '500'}, upload the screenshot or transaction receipt in the booking form.`,
      display_order: 4
    },
    {
      id: 5,
      category: 'Reports & Files',
      question: 'Can I upload MRI, X-ray, or doctor notes?',
      answer: 'Yes. You can upload up to 5 files in PDF, JPG, JPEG, or PNG formats directly during the booking process. If you do not currently have reports, you can select "No" and proceed without them.',
      display_order: 5
    },
    {
      id: 6,
      category: 'Technical Setup',
      question: 'What equipment or device do I need for the video consultation?',
      answer: 'Any smartphone, tablet, or computer with a working camera, microphone, and a stable internet connection is sufficient. It is helpful to be in a quiet room with enough space to step back 4–6 feet for movement and posture observation.',
      display_order: 6
    },
    {
      id: 7,
      category: 'Emergency & Triage',
      question: 'Can I use this service during a medical emergency?',
      answer: 'No. Online physiotherapy consultation is intended for non-emergency assessment and professional guidance based on information provided during the consultation. In case of a medical emergency or acute trauma, please visit an emergency medical facility immediately.',
      display_order: 7
    },
  ];

  const activeFaqs = cmsFaqs.length > 0 ? cmsFaqs : defaultFaqs;

  const categories = ['All', ...Array.from(new Set(activeFaqs.map(f => f.category)))];

  const filteredFaqs = activeFaqs.filter(faq => {
    const matchesCat = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const canonicalUrl = getCanonicalUrl('/faq');
  const ogImageUrl = getOgImageUrl('/kiva-logo.svg');
  const pageTitle = "Frequently Asked Questions (FAQ) | Kiva Physiotherapy Clinic";
  const pageDescription = "Find answers to common questions about online physiotherapy consultations, standard ₹500 fee, payment methods, medical report uploads, and technical setup.";
  const faqSchema = useMemo(() => buildFaqSchema(activeFaqs, canonicalUrl), [activeFaqs, canonicalUrl]);

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="physiotherapy FAQ, online physio consultation questions, UPI physio payment, video consultation preparation, Dr Naresh PT faq" />
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
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-teal-100/90 text-teal-900 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-teal-200 shadow-xs">
            <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-teal-600/30">
              <img src="/kiva-logo.svg" alt="Kiva Logo" className="w-full h-full object-contain" />
            </div>
            <span>Kiva Patient Information Desk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Everything you need to know about our virtual consultations, appointment flow, and payment verification.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions by keyword (e.g., payment, fee, reports, video)..."
              className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
              No matching questions found. Try a different keyword or view all categories.
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.id || idx}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                        {faq.category}
                      </span>
                      <h2 className="text-base font-bold text-slate-900">
                        {faq.question}
                      </h2>
                    </div>
                    <div className="p-2 rounded-full bg-slate-100 text-slate-600 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still have questions? */}
        <div className="bg-teal-900 text-white rounded-3xl p-8 text-center space-y-4 shadow-sm">
          <h2 className="text-xl font-bold">Have Additional Questions?</h2>
          <p className="text-sm text-teal-200 max-w-md mx-auto">
            Our clinic team is available to assist you with booking or technical queries directly on WhatsApp.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp ({settings.phone_number || '9875138912'})</span>
            </a>

            <button
              onClick={() => onNavigate('appointments')}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-teal-950 font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-sm"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Consultation — ₹{settings.consultation_fee || '500'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
