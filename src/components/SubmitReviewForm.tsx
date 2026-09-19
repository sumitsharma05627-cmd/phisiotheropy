import React, { useState, useRef } from 'react';
import { 
  Star, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Image as ImageIcon,
  Sparkles,
  UserCheck
} from 'lucide-react';

interface SubmitReviewFormProps {
  onReviewSubmitted?: () => void;
  className?: string;
  isEmbedded?: boolean;
}

export const SubmitReviewForm: React.FC<SubmitReviewFormProps> = ({ 
  onReviewSubmitted,
  className = '',
  isEmbedded = true
}) => {
  // Form input states
  const [patientName, setPatientName] = useState('');
  const [city, setCity] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [photoBase64, setPhotoBase64] = useState<string>('');
  const [photoName, setPhotoName] = useState<string>('');
  const [photoSize, setPhotoSize] = useState<string>('');
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [consent, setConsent] = useState<boolean>(true);

  // Status & validation states
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const ratingDescriptions: Record<number, string> = {
    1: '1 Star — Needs Improvement',
    2: '2 Stars — Fair Guidance',
    3: '3 Stars — Good Assessment',
    4: '4 Stars — Very Effective & Helpful',
    5: '5 Stars — Excellent Rehabilitation Experience'
  };

  const processFile = (file: File) => {
    setErrorMessage(null);

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 5MB limit. Please choose a smaller photo.');
      return;
    }

    const sizeFormatted = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    setPhotoName(file.name);
    setPhotoSize(sizeFormatted);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPhotoBase64(result);
      setPhotoPreview(result);
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removePhoto = () => {
    setPhotoBase64('');
    setPhotoName('');
    setPhotoSize('');
    setPhotoPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetForm = () => {
    setPatientName('');
    setCity('');
    setRating(5);
    setHoverRating(null);
    setReviewText('');
    removePhoto();
    setConsent(true);
    setSubmittedSuccess(null);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmittedSuccess(null);

    // Validate
    if (!patientName.trim()) {
      setErrorMessage('Please enter your full name or preferred display name.');
      return;
    }

    if (!reviewText.trim()) {
      setErrorMessage('Please share details of your physiotherapy assessment or recovery experience.');
      return;
    }

    if (reviewText.trim().length < 15) {
      setErrorMessage('Please write at least 15 characters to provide meaningful feedback.');
      return;
    }

    if (!consent) {
      setErrorMessage('Please confirm consent to display your recovery experience.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/reviews/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientName: patientName.trim(),
          city: city.trim() || undefined,
          rating,
          reviewText: reviewText.trim(),
          photoBase64: photoBase64 || undefined,
          photoName: photoName || undefined,
          consent: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit your review. Please try again.');
      }

      setSubmittedSuccess(
        `Thank you, ${patientName.trim()}! Your review has been saved with status "pending" and is awaiting administrator approval before appearing publicly.`
      );

      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const activeRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div 
      id="submit-review-form-card" 
      className={`bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 md:p-10 ${className}`}
    >
      {/* Form Header */}
      <div className="border-b border-slate-100 pb-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Patient Experience Submission</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Submit a Patient Review
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Share your assessment experience and recovery milestones to help other patients make informed healthcare decisions.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200/80 rounded-2xl px-4 py-2.5 text-amber-900 text-xs shrink-0 max-w-xs">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="leading-tight">
              Stored with <strong>'pending'</strong> status — published after admin review.
            </span>
          </div>
        </div>

        {/* Mobile notice banner */}
        <div className="sm:hidden mt-3 flex items-center gap-2 bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-amber-900 text-xs">
          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="leading-tight">
            Stored with <strong>'pending'</strong> status — published after clinical admin review.
          </span>
        </div>
      </div>

      {submittedSuccess ? (
        /* Success State */
        <div 
          id="review-submitted-success-box" 
          className="bg-emerald-50/90 border-2 border-emerald-300 rounded-3xl p-8 sm:p-10 text-center space-y-5 animate-in fade-in zoom-in-95 duration-300"
        >
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-emerald-950">
              Review Submitted Successfully!
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
              {submittedSuccess}
            </p>
          </div>

          {/* Clinical Moderation Badge */}
          <div className="inline-flex items-center gap-2 bg-white/90 border border-emerald-300 text-emerald-900 text-xs px-4 py-2 rounded-full shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Moderation Status: <strong>Pending Approval</strong></span>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="submit-another-review-btn"
              type="button"
              onClick={resetForm}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs transition-all"
            >
              <UserCheck className="w-4 h-4" />
              <span>Submit Another Review</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {errorMessage && (
            <div 
              id="review-submit-error" 
              className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs sm:text-sm text-rose-800 flex items-start gap-3 animate-in fade-in duration-200"
            >
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold block mb-0.5">Please check your submission:</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Row 1: Patient Name & Optional City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label 
                htmlFor="review-form-patient-name" 
                className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5"
              >
                Patient Name <span className="text-teal-600">*</span>
              </label>
              <input
                id="review-form-patient-name"
                name="patientName"
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Ramesh Kumar, Priya S."
                disabled={submitting}
                className="w-full text-sm border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                You may use your first name and initial if you prefer privacy.
              </p>
            </div>

            <div>
              <label 
                htmlFor="review-form-city" 
                className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5"
              >
                City / Location <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                id="review-form-city"
                name="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Mumbai, Kolkata, London"
                disabled={submitting}
                className="w-full text-sm border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Helps other patients know where you consulted from.
              </p>
            </div>
          </div>

          {/* Row 2: Star Rating Selection */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-slate-800">
              Overall Rating <span className="text-teal-600">*</span>
            </label>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div 
                className="flex items-center gap-1.5"
                onMouseLeave={() => setHoverRating(null)}
              >
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= activeRating;
                  return (
                    <button
                      key={star}
                      type="button"
                      id={`star-rating-btn-${star}`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      disabled={submitting}
                      className="p-1.5 rounded-lg hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-transform ${
                          isFilled
                            ? 'text-amber-400 fill-amber-400 scale-105'
                            : 'text-slate-300 hover:text-amber-200'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <span className="text-xs sm:text-sm font-semibold text-slate-700 sm:ml-2">
                {ratingDescriptions[activeRating] || `${activeRating} Stars`}
              </span>
            </div>
          </div>

          {/* Row 3: Review Text Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label 
                htmlFor="review-form-text" 
                className="block text-xs sm:text-sm font-bold text-slate-800"
              >
                Your Review & Recovery Story <span className="text-teal-600">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {reviewText.length} characters
              </span>
            </div>
            <textarea
              id="review-form-text"
              name="reviewText"
              rows={4}
              required
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Please describe your condition (e.g., lower back stiffness, neck pain), how the video consultation was carried out, and how the exercises and rehabilitation plan helped your recovery..."
              disabled={submitting}
              className="w-full text-sm border border-slate-300 rounded-xl p-4 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition-all leading-relaxed"
            />
          </div>

          {/* Row 4: Photo Submission */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
              Photo Submission <span className="text-slate-400 font-normal">(Optional)</span>
            </label>

            {photoPreview ? (
              /* Photo Preview Card */
              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-teal-50/60 border border-teal-200">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-teal-300 bg-white shrink-0 shadow-2xs">
                    <img 
                      src={photoPreview} 
                      alt="Review preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {photoName || 'patient-photo.jpg'}
                    </p>
                    <p className="text-[11px] text-teal-700 font-medium">
                      {photoSize || 'Image ready'} • Ready for submission
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removePhoto}
                  disabled={submitting}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                  aria-label="Remove uploaded photo"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              /* Drag & Drop / File Input */
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragOver 
                    ? 'border-teal-500 bg-teal-50/60 scale-[1.01]' 
                    : 'border-slate-300 hover:border-teal-400 hover:bg-slate-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handlePhotoSelect}
                  className="hidden"
                  disabled={submitting}
                />

                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-11 h-11 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200/80 shadow-2xs">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-xs sm:text-sm text-slate-700">
                    <span className="font-bold text-teal-700 hover:underline">
                      Click to upload a photo
                    </span>{' '}
                    or drag and drop here
                  </div>
                  <p className="text-[11px] text-slate-400">
                    JPG, PNG, or WebP up to 5MB (Patient portrait or mobility recovery progress)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Row 5: Moderation Transparency & Consent Checkbox */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
            <div className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>
                <strong>Moderation Notice:</strong> To ensure patient privacy and clinical authenticity, all submissions are stored with status <strong>'pending'</strong> and require administrator approval before appearing publicly on this website.
              </span>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer pt-1 border-t border-slate-200/70">
              <input
                id="review-consent-agree"
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                disabled={submitting}
                className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
              />
              <span className="text-xs text-slate-700 font-medium leading-snug">
                I confirm this represents my authentic personal healthcare experience and grant Kiva Physiotherapy Clinic consent to publish this review on this website upon approval.
              </span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Fields marked with <span className="text-teal-600 font-bold">*</span> are required.
            </div>

            <div className="flex items-center gap-3">
              <button
                id="submit-review-form-submit-btn"
                type="submit"
                disabled={submitting || !patientName.trim() || !reviewText.trim() || !consent}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm px-7 py-3 rounded-xl shadow-sm transition-all"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving Pending Review...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Review for Approval</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
