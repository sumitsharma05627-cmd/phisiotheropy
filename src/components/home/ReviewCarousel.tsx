import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, MessageSquare, Quote } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

interface ReviewCarouselProps {
  onNavigate: (page: string) => void;
}

export const ReviewCarousel: React.FC<ReviewCarouselProps> = ({ onNavigate }) => {
  const { featuredReviews } = useClinic();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter strictly approved reviews
  const approvedReviews = (featuredReviews || []).filter(
    (rev) => rev.status === 'APPROVED' || !rev.status
  );

  const totalReviews = approvedReviews.length;

  // Auto-slide every 5 seconds unless hovered
  useEffect(() => {
    if (totalReviews <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalReviews);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [totalReviews, isPaused]);

  const handlePrev = () => {
    if (totalReviews === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalReviews) % totalReviews);
  };

  const handleNext = () => {
    if (totalReviews === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalReviews);
  };

  return (
    <section className="bg-slate-100/70 py-16 sm:py-20 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/90 text-teal-800 text-xs font-bold uppercase tracking-wider">
              Verified Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              What Our Patients Say
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Honest feedback from patients who completed their physiotherapy assessment and recovery sessions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {totalReviews > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-900 flex items-center justify-center shadow-xs transition-colors"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-900 flex items-center justify-center shadow-xs transition-colors"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            <button
              onClick={() => onNavigate('reviews')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-800 hover:underline px-3 py-2 rounded-xl bg-white border border-slate-200"
            >
              <span>View All Reviews →</span>
            </button>
          </div>
        </div>

        {/* Carousel Content or Empty State */}
        {totalReviews === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs max-w-xl mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">
              Patient reviews will appear here once approved by the clinic.
            </p>
            <p className="text-xs text-slate-500">
              Have you consulted with Kiva Physiotherapy Clinic? You can share your story from our reviews page.
            </p>
            <button
              onClick={() => onNavigate('reviews')}
              className="inline-flex items-center gap-2 bg-teal-600 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-teal-700"
            >
              Share Your Review
            </button>
          </div>
        ) : (
          <div 
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Displaying Card with smooth transition */}
            <div className="overflow-hidden">
              <div 
                className="transition-transform duration-500 ease-out flex"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {approvedReviews.map((rev) => (
                  <div key={rev.id} className="w-full shrink-0 px-1">
                    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 lg:p-10 shadow-xs flex flex-col md:flex-row gap-6 sm:gap-8 items-start justify-between">
                      
                      {/* Review Text */}
                      <div className="space-y-4 max-w-3xl">
                        {/* Rating Stars */}
                        <div className="flex items-center gap-1.5">
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
                          <span className="text-xs font-bold text-slate-500 ml-2">
                            {rev.rating || 5}.0 Rating
                          </span>
                        </div>

                        <div className="relative">
                          <Quote className="w-8 h-8 text-teal-100 absolute -top-3 -left-2 -z-0" />
                          <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-normal relative z-10 italic">
                            "{rev.review_text}"
                          </p>
                        </div>

                        {rev.condition_treated && (
                          <div className="inline-flex items-center gap-1.5 text-xs text-teal-800 bg-teal-50 px-3 py-1 rounded-full font-medium">
                            <span>Condition: {rev.condition_treated}</span>
                          </div>
                        )}
                      </div>

                      {/* Patient Details & Avatar / Approved photo */}
                      <div className="shrink-0 flex items-center md:flex-col md:items-start gap-3.5 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-8 min-w-[200px]">
                        {(rev.patient_photo_url || rev.photo_url) ? (
                          <img
                            src={(rev.patient_photo_url || rev.photo_url)!}
                            alt={rev.patient_name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-teal-500/30 shadow-xs"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-teal-700 text-white font-bold text-lg flex items-center justify-center shadow-xs">
                            {rev.patient_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h4 className="text-base font-bold text-slate-900 leading-snug">
                            {rev.patient_name}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {[rev.city, rev.age ? `${rev.age} yrs` : null].filter(Boolean).join(' • ') || 'Verified Patient'}
                          </p>
                          <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            Verified Care
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots Indicator */}
            {totalReviews > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                {approvedReviews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentIndex === idx
                        ? 'w-7 bg-teal-700'
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
