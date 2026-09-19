import React, { useState, useEffect, useRef } from 'react';
import { 
  Star, 
  MessageSquare, 
  UserCheck, 
  ShieldCheck, 
  CheckCircle2, 
  CalendarCheck, 
  Clock,
  Sparkles,
  ArrowDown
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { Helmet } from 'react-helmet-async';
import { getCanonicalUrl, getOgImageUrl } from '../utils/seoHelper';
import { SubmitReviewForm } from '../components/SubmitReviewForm';
import { PatientReview } from '../types';
import { buildReviewsSchema } from '../utils/seoSchemas';

interface ReviewsPageProps {
  onNavigate: (page: string) => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ onNavigate }) => {
  const { settings, featuredReviews } = useClinic();
  const [reviews, setReviews] = useState<PatientReview[]>(featuredReviews || []);
  const [loading, setLoading] = useState<boolean>(true);
  const formRef = useRef<HTMLDivElement>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        if (data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews);
        } else if (featuredReviews && featuredReviews.length > 0) {
          setReviews(featuredReviews);
        } else {
          setReviews([]);
        }
      }
    } catch (err) {
      console.warn('Could not fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [featuredReviews]);

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const nameInput = document.getElementById('review-form-patient-name');
      if (nameInput) {
        setTimeout(() => nameInput.focus(), 500);
      }
    }
  };

  const canonicalUrl = getCanonicalUrl('/reviews');
  const ogImageUrl = getOgImageUrl('/kiva-logo.svg');
  const pageTitle = "Patient Reviews & Ratings | Kiva Physiotherapy Clinic";
  const pageDescription = "Read verified patient reviews, ratings, and recovery stories from individuals who completed online physiotherapy consultations with Dr. Naresh (PT).";
  const reviewsSchema = buildReviewsSchema(reviews, settings.clinic_name);

  return (
    <div className="bg-slate-50 min-h-screen">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="physiotherapy clinic reviews, Dr Naresh PT patient ratings, online physio feedback, spine recovery reviews, Kiva clinic testimonials" />
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
          {JSON.stringify(reviewsSchema)}
        </script>
      </Helmet>

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-teal-900 via-teal-950 to-slate-900 text-white pt-14 pb-16 px-4 sm:px-6 lg:px-8 border-b border-teal-800/60">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-teal-800/80 border border-teal-700 text-teal-200 text-xs font-semibold uppercase tracking-wider shadow-xs">
            <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-teal-500/40">
              <img src="/kiva-logo.svg" alt="Kiva Logo" className="w-full h-full object-contain" />
            </div>
            <span>Verified Patient Experiences</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Patient Stories & Feedback
          </h1>

          <p className="text-base sm:text-lg text-teal-100/90 max-w-2xl mx-auto leading-relaxed">
            Real feedback from patients who sought guidance for pain management, spine posture, and joint rehabilitation.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              id="hero-submit-review-btn"
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all active:scale-98"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Submit a Review</span>
              <ArrowDown className="w-3.5 h-3.5 opacity-80" />
            </button>
            <button
              onClick={() => onNavigate('appointments')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm px-5 py-3 rounded-xl border border-white/20 transition-colors"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Consultation</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Reviews Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Ethical Standards & Consent Notice */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-teal-50/90 border border-teal-200 text-teal-950 text-xs sm:text-sm flex items-start gap-3.5 shadow-2xs">
          <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold block mb-0.5 text-teal-900">
              Patient Privacy & Clinical Moderation Policy
            </span>
            All patient reviews displayed on this page are verified and approved. New submissions are stored with a <strong>'pending'</strong> status in our clinical database, requiring administrator approval before appearing publicly to protect patient privacy and verify authentic clinical feedback.
          </div>
        </div>

        {/* Reviews Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Published Recovery Stories ({reviews.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified evaluations and testimonials from patients treated via our tele-rehabilitation clinic.
            </p>
          </div>

          <button
            onClick={scrollToForm}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3.5 py-2 rounded-xl transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-500">
            <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm">Loading verified patient reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3 shadow-xs">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No approved reviews yet</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Be the first to share your experience with Kiva Physiotherapy Clinic. Use the form below to submit your recovery feedback.
            </p>
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-4 py-2 rounded-xl transition-all"
            >
              Submit First Review
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                id={`review-card-${rev.id}`}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= (rev.rating || 5)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                    {rev.rating && (
                      <span className="text-xs font-bold text-slate-600 ml-1.5">
                        {rev.rating}.0
                      </span>
                    )}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-slate-700 leading-relaxed italic">
                    "{rev.review_text}"
                  </p>
                </div>

                {/* Patient Profile & Photo Snippet */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  {rev.photo_url ? (
                    <img
                      src={rev.photo_url}
                      alt={rev.patient_name}
                      className="w-11 h-11 rounded-full object-cover border border-teal-200 shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-bold flex items-center justify-center shrink-0 text-sm">
                      {rev.patient_name.charAt(0)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {rev.patient_name}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">
                      {[rev.city, rev.age ? `${rev.age} yrs` : null].filter(Boolean).join(' • ') || 'Verified Patient'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dedicated Submit Review Form Section */}
        <div ref={formRef} id="submit-review-form" className="mt-14 scroll-mt-24">
          <SubmitReviewForm onReviewSubmitted={fetchReviews} />
        </div>

        {/* Bottom Consultation CTA */}
        <div className="mt-16 bg-white rounded-3xl border border-teal-200/90 p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Ready to Begin Your Recovery?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Schedule your video consultation with detailed functional assessment from home.
            </p>
          </div>
          <button
            onClick={() => onNavigate('appointments')}
            className="shrink-0 inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-sm transition-all active:scale-98"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Book Consultation — ₹{settings.consultation_fee || '500'}</span>
          </button>
        </div>

      </section>
    </div>
  );
};
