import React, { useState, useMemo } from 'react';
import { ChevronDown, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { Helmet } from 'react-helmet-async';
import { getCanonicalUrl } from '../../utils/seoHelper';
import { buildFaqSchema } from '../../utils/seoSchemas';

interface FaqAccordionProps {
  onNavigate: (page: string) => void;
  pagePath?: string;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({ onNavigate, pagePath = '/' }) => {
  const { faqs, settings } = useClinic();
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First open by default

  const fee = settings.consultation_fee || '500';
  const paymentNum = settings.payment_number || '9875138912';

  // Standard required questions with dynamic settings integration
  const defaultFaqs = [
    {
      id: 1,
      question: 'How does online consultation work?',
      answer: 'After you book and submit your consultation details, you will receive a secure video consultation link. During the call, our certified physiotherapist reviews your symptoms, conducts guided active movement and range-of-motion assessments, and demonstrates targeted rehabilitation exercises.'
    },
    {
      id: 2,
      question: 'How much does a consultation cost?',
      answer: `Our standard online physiotherapy consultation is ₹${fee}. There are no hidden charges. This covers the comprehensive assessment, movement observation, and personalized exercise plan.`
    },
    {
      id: 3,
      question: 'How do I book?',
      answer: 'Simply click "Book Appointment", choose your preferred date and time slot, enter your contact info and main complaint, complete the fee transfer, and your booking request will be confirmed by our clinic team.'
    },
    {
      id: 4,
      question: 'How can I pay?',
      answer: `We accept UPI transfers (Google Pay, PhonePe, Paytm) and direct bank transfers to ${paymentNum}. You can submit your transaction reference ID or screenshot during booking for quick verification.`
    },
    {
      id: 5,
      question: 'Can I upload my MRI/X-ray reports?',
      answer: 'Yes. You can attach past radiology reports, MRI summaries, or doctor prescriptions directly in the booking form, or share them securely over WhatsApp before your scheduled session.'
    },
    {
      id: 6,
      question: 'How will I receive my consultation link?',
      answer: 'Your secure Google Meet / WhatsApp Video link will be sent to your registered phone number via WhatsApp and SMS well in advance of your scheduled slot time.'
    },
    {
      id: 7,
      question: 'Can I reschedule?',
      answer: 'Yes, appointments can be rescheduled up to 4 hours before the scheduled time by messaging us directly on WhatsApp or contacting the clinic team.'
    }
  ];

  // Merge admin-added FAQs with default questions if any exist
  const displayFaqs = faqs && faqs.length > 0 ? faqs : defaultFaqs;

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  // Generate dynamic JSON-LD 'FAQPage' schema mapping currently configured admin/clinic questions
  const canonicalUrl = getCanonicalUrl(pagePath);
  const faqSchema = useMemo(() => {
    return buildFaqSchema(displayFaqs, canonicalUrl);
  }, [displayFaqs, canonicalUrl]);

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <Helmet>
        {/* Dynamic Schema.org FAQPage structured data for rich search results */}
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>
      
      {/* Header */}
      <div className="text-center space-y-2.5 mb-12">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold uppercase tracking-wider">
          Got Questions?
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Clear, upfront answers about our consultation process, payment, and appointments.
        </p>
      </div>

      {/* Accordion Container */}
      <div className="space-y-3">
        {displayFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.id || idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-white border-teal-300 shadow-sm'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left px-5 sm:px-6 py-4 flex items-center justify-between gap-4 focus:outline-none"
                aria-expanded={isOpen}
              >
                <span className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {faq.question}
                </span>
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  isOpen ? 'bg-teal-100 text-teal-800 rotate-180' : 'bg-slate-100 text-slate-500'
                }`}>
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in-50 duration-150">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom link to full FAQ page & support */}
      <div className="mt-10 p-5 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <HelpCircle className="w-5 h-5 text-teal-700 shrink-0" />
          <div className="text-xs text-slate-700">
            Have a specific condition question or doubt before booking?
          </div>
        </div>
        <button
          onClick={() => onNavigate('faq')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-900 bg-white px-4 py-2 rounded-xl border border-teal-200 shadow-xs hover:shadow transition-all"
        >
          <span>View All Consultation FAQs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </section>
  );
};
