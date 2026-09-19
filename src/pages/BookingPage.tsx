import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  FileText, 
  Upload, 
  X, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  Copy, 
  ArrowRight, 
  ArrowLeft,
  Activity,
  FileCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { BookingFormData, BookingSubmissionResponse, ConsultationTimeSlot, Gender } from '../types';
import { useClinic } from '../context/ClinicContext';
import { Helmet } from 'react-helmet-async';
import { getCanonicalUrl, getOgImageUrl } from '../utils/seoHelper';

interface BookingPageProps {
  onSuccess: (result: BookingSubmissionResponse) => void;
  onNavigate: (page: string) => void;
  initialReason?: string;
}

export const BookingPage: React.FC<BookingPageProps> = ({ onSuccess, onNavigate, initialReason }) => {
  const { settings } = useClinic();
  const consultationFee = settings.consultation_fee || '500';
  const paymentNumber = settings.payment_number || '9875138912';

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Form State
  const [formData, setFormData] = useState<BookingFormData>({
    patient: {
      fullName: '',
      age: '',
      gender: '',
      phone: '',
      email: '',
      cityCountry: '',
    },
    health: {
      problemDescription: initialReason ? `Consultation for ${initialReason}: ` : '',
      problemDuration: '',
      painLevel: 3,
      hasMedicalReports: false,
    },
    schedule: {
      preferredTime: 'Morning',
    },
    payment: {
      method: 'PhonePe / Paytm / Google Pay',
      confirmedCorrect: false,
    },
    files: {
      medicalReports: [],
      paymentScreenshot: null,
    },
  });

  useEffect(() => {
    if (initialReason && !formData.health.problemDescription) {
      setFormData(prev => ({
        ...prev,
        health: {
          ...prev.health,
          problemDescription: `Consultation for ${initialReason}: `
        }
      }));
    }
  }, [initialReason]);

  // Helper for pain severity classification
  const getPainCategory = (level: number) => {
    if (level === 0) return { label: 'No Pain', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (level <= 3) return { label: 'Mild Pain', color: 'text-teal-700 bg-teal-50 border-teal-200' };
    if (level <= 6) return { label: 'Moderate Pain', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Severe Pain', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  // Copy payment phone number
  const copyPaymentNumber = () => {
    navigator.clipboard.writeText(paymentNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    const { fullName, age, gender, phone, email } = formData.patient;
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return false;
    }
    if (!age || Number(age) < 1 || Number(age) > 120) {
      setErrorMsg('Please enter a valid age.');
      return false;
    }
    if (!gender) {
      setErrorMsg('Please select your gender.');
      return false;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMsg('Please enter a valid WhatsApp / Phone number.');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  // Step 2 Validation
  const validateStep2 = (): boolean => {
    const { problemDescription, problemDuration } = formData.health;
    if (!problemDescription.trim()) {
      setErrorMsg('Please describe the problem you are facing.');
      return false;
    }
    if (!problemDuration.trim()) {
      setErrorMsg('Please specify since when you are having this problem.');
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  // Step 3 Validation
  const validateStep3 = (): boolean => {
    if (!formData.schedule.preferredTime) {
      setErrorMsg('Please select your preferred consultation time.');
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  // Step 4 Validation
  const validateStep4 = (): boolean => {
    if (!formData.payment.confirmedCorrect) {
      setErrorMsg('Please confirm that the provided information is correct.');
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 3 && validateStep3()) {
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle Medical Reports Upload
  const handleReportsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const currentFiles = [...formData.files.medicalReports];

    Array.from(files).forEach((file) => {
      if (currentFiles.length >= 5) {
        setErrorMsg('Maximum of 5 medical report files allowed.');
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        setErrorMsg(`Unsupported file type: ${file.name}. Only PDF, JPG, JPEG, and PNG are accepted.`);
        return;
      }

      // Check max size (25MB in browser)
      if (file.size > 25 * 1024 * 1024) {
        setErrorMsg(`File ${file.name} exceeds the 25 MB upload limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        currentFiles.push({
          name: file.name,
          mimeType: file.type,
          base64,
          size: file.size,
        });
        setFormData((prev) => ({
          ...prev,
          files: {
            ...prev.files,
            medicalReports: [...currentFiles],
          },
        }));
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const removeReport = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: {
        ...prev.files,
        medicalReports: prev.files.medicalReports.filter((_, i) => i !== index),
      },
    }));
  };

  // Handle Payment Screenshot Upload
  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg(`Unsupported file format. Please upload JPG, PNG, or PDF payment proof.`);
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg(`Screenshot file exceeds 25 MB limit.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        files: {
          ...prev.files,
          paymentScreenshot: {
            name: file.name,
            mimeType: file.type,
            base64: reader.result as string,
            size: file.size,
          },
        },
      }));
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  // Final Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep4()) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit appointment request.');
      }

      onSuccess(data);
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMsg(err.message || 'Network error occurred while submitting your appointment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentPain = getPainCategory(formData.health.painLevel);
  const canonicalUrl = getCanonicalUrl('/booking');
  const ogImageUrl = getOgImageUrl('/kiva-logo.svg');
  const bookingPageTitle = `Book Online Physiotherapy Consultation (₹${consultationFee}) | Kiva Clinic`;
  const bookingPageDescription = `Schedule your online physiotherapy consultation with Dr. Naresh (PT) for ₹${consultationFee}. Quick 4-step booking, report upload, and verified appointment slot.`;

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <Helmet>
        <title>{bookingPageTitle}</title>
        <meta name="title" content={bookingPageTitle} />
        <meta name="description" content={bookingPageDescription} />
        <meta name="keywords" content="book physiotherapy online, online physio appointment, tele-rehab booking, schedule physio consultation, Dr Naresh PT appointment" />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={bookingPageTitle} />
        <meta property="og:description" content={bookingPageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Kiva Physiotherapy Clinic" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:alt" content={bookingPageTitle} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={bookingPageTitle} />
        <meta name="twitter:description" content={bookingPageDescription} />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:image:alt" content={bookingPageTitle} />

        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Online Physiotherapy Consultation Booking',
            provider: {
              '@type': 'MedicalBusiness',
              name: 'Kiva Physiotherapy Clinic',
            },
            offers: {
              '@type': 'Offer',
              price: consultationFee,
              priceCurrency: 'INR',
            },
          })}
        </script>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header Title */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 bg-teal-100/90 text-teal-900 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-teal-200 shadow-xs">
            <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-teal-600/30">
              <img src="/kiva-logo.svg" alt="Kiva Logo" className="w-full h-full object-contain" />
            </div>
            <span>Kiva Physiotherapy Clinic • Patient Booking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Book Online Physiotherapy Consultation
          </h1>
          <p className="text-sm text-slate-600">
            Complete the 4 simple steps below. Consultation fee: <strong className="text-teal-800 font-bold">₹{consultationFee}</strong>
          </p>
        </div>

        {/* Step Indicator Bar */}
        <div className="mb-8 bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            
            <div className={`flex flex-col items-center gap-1.5 ${currentStep >= 1 ? 'text-teal-700 font-bold' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                currentStep > 1 
                  ? 'bg-teal-600 text-white' 
                  : currentStep === 1 
                    ? 'bg-teal-100 text-teal-800 border-2 border-teal-600' 
                    : 'bg-slate-100 text-slate-400'
              }`}>
                {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <span className="hidden sm:inline">Patient Details</span>
              <span className="sm:hidden">Details</span>
            </div>

            <div className={`flex flex-col items-center gap-1.5 ${currentStep >= 2 ? 'text-teal-700 font-bold' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                currentStep > 2 
                  ? 'bg-teal-600 text-white' 
                  : currentStep === 2 
                    ? 'bg-teal-100 text-teal-800 border-2 border-teal-600' 
                    : 'bg-slate-100 text-slate-400'
              }`}>
                {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
              </div>
              <span className="hidden sm:inline">Health Info</span>
              <span className="sm:hidden">Health</span>
            </div>

            <div className={`flex flex-col items-center gap-1.5 ${currentStep >= 3 ? 'text-teal-700 font-bold' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                currentStep > 3 
                  ? 'bg-teal-600 text-white' 
                  : currentStep === 3 
                    ? 'bg-teal-100 text-teal-800 border-2 border-teal-600' 
                    : 'bg-slate-100 text-slate-400'
              }`}>
                {currentStep > 3 ? <Check className="w-4 h-4" /> : '3'}
              </div>
              <span className="hidden sm:inline">Preferred Time</span>
              <span className="sm:hidden">Time</span>
            </div>

            <div className={`flex flex-col items-center gap-1.5 ${currentStep === 4 ? 'text-teal-700 font-bold' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                currentStep === 4 
                  ? 'bg-teal-100 text-teal-800 border-2 border-teal-600' 
                  : 'bg-slate-100 text-slate-400'
              }`}>
                4
              </div>
              <span className="hidden sm:inline">Payment</span>
              <span className="sm:hidden">Pay</span>
            </div>

          </div>

          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-teal-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorMsg}</div>
            <button onClick={() => setErrorMsg(null)} className="text-rose-500 hover:text-rose-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Multi-Step Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md">
          
          {/* STEP 1: PATIENT DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Step 1: Patient Details</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Please provide your personal contact information for consultation coordination.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Full Name */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label htmlFor="patient-full-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="patient-full-name"
                      type="text"
                      required
                      placeholder="e.g. Ramesh Sharma"
                      value={formData.patient.fullName}
                      onChange={(e) => setFormData({
                        ...formData,
                        patient: { ...formData.patient, fullName: e.target.value }
                      })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                    />
                  </div>
                </div>

                {/* Age */}
                <div className="space-y-1.5">
                  <label htmlFor="patient-age" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Age <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="patient-age"
                    type="number"
                    required
                    min="1"
                    max="120"
                    placeholder="e.g. 35"
                    value={formData.patient.age}
                    onChange={(e) => setFormData({
                      ...formData,
                      patient: { ...formData.patient, age: e.target.value ? Number(e.target.value) : '' }
                    })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Gender <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      id="gender-male"
                      onClick={() => setFormData({
                        ...formData,
                        patient: { ...formData.patient, gender: 'Male' }
                      })}
                      className={`py-2.5 px-4 rounded-xl text-sm font-semibold border text-center transition-all ${
                        formData.patient.gender === 'Male'
                          ? 'bg-teal-50 border-teal-600 text-teal-900 ring-2 ring-teal-500/20'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      id="gender-female"
                      onClick={() => setFormData({
                        ...formData,
                        patient: { ...formData.patient, gender: 'Female' }
                      })}
                      className={`py-2.5 px-4 rounded-xl text-sm font-semibold border text-center transition-all ${
                        formData.patient.gender === 'Female'
                          ? 'bg-teal-50 border-teal-600 text-teal-900 ring-2 ring-teal-500/20'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>

                {/* Phone / WhatsApp */}
                <div className="space-y-1.5">
                  <label htmlFor="patient-phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Phone Number (WhatsApp) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="patient-phone"
                      type="tel"
                      required
                      placeholder="e.g. 9875138912"
                      value={formData.patient.phone}
                      onChange={(e) => setFormData({
                        ...formData,
                        patient: { ...formData.patient, phone: e.target.value }
                      })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Consultation link and timing updates will be shared here.
                  </p>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="patient-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="patient-email"
                      type="email"
                      required
                      placeholder="e.g. patient@example.com"
                      value={formData.patient.email}
                      onChange={(e) => setFormData({
                        ...formData,
                        patient: { ...formData.patient, email: e.target.value }
                      })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                    />
                  </div>
                </div>

                {/* City / Country */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label htmlFor="patient-city" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    City / Country
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="patient-city"
                      type="text"
                      placeholder="e.g. Delhi, India or London, UK"
                      value={formData.patient.cityCountry}
                      onChange={(e) => setFormData({
                        ...formData,
                        patient: { ...formData.patient, cityCountry: e.target.value }
                      })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                    />
                  </div>
                </div>

              </div>

              {/* Navigation button */}
              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  id="step1-next-btn"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-7 py-3 rounded-xl transition-all shadow-sm"
                >
                  <span>Continue to Health Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: HEALTH INFORMATION */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Step 2: Health Information</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Please describe your symptoms and pain severity for clinical preparation.
                </p>
              </div>

              {/* Problem description */}
              <div className="space-y-1.5">
                <label htmlFor="health-problem-desc" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  What problem are you facing? <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="health-problem-desc"
                  rows={4}
                  required
                  placeholder="Describe your symptoms (e.g. neck pain spreading to shoulder, difficulty bending lower back, knee stiffness after walking...)"
                  value={formData.health.problemDescription}
                  onChange={(e) => setFormData({
                    ...formData,
                    health: { ...formData.health, problemDescription: e.target.value }
                  })}
                  className="w-full p-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>

              {/* Since when */}
              <div className="space-y-1.5">
                <label htmlFor="health-problem-duration" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Since when are you having this problem? <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="health-problem-duration"
                    type="text"
                    required
                    placeholder="e.g. 2 weeks, since yesterday, or 6 months"
                    value={formData.health.problemDuration}
                    onChange={(e) => setFormData({
                      ...formData,
                      health: { ...formData.health, problemDuration: e.target.value }
                    })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  />
                </div>
              </div>

              {/* Pain Level (0–10) Selector */}
              <div className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Pain Level (0–10)
                  </label>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${currentPain.color}`}>
                    Level {formData.health.painLevel}: {currentPain.label}
                  </span>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={formData.health.painLevel}
                  onChange={(e) => setFormData({
                    ...formData,
                    health: { ...formData.health, painLevel: Number(e.target.value) }
                  })}
                  className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />

                {/* Number selector buttons */}
                <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5 pt-1">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        health: { ...formData.health, painLevel: level }
                      })}
                      className={`h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                        formData.health.painLevel === level
                          ? 'bg-teal-700 text-white shadow-sm ring-2 ring-teal-500/30'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>

                {/* Legend */}
                <div className="grid grid-cols-4 text-center text-[11px] text-slate-500 pt-2 border-t border-slate-200/80">
                  <span>0: No Pain</span>
                  <span>1–3: Mild</span>
                  <span>4–6: Moderate</span>
                  <span>7–10: Severe</span>
                </div>
              </div>

              {/* Reports Query */}
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Do you have MRI / X-ray / medical reports?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      health: { ...formData.health, hasMedicalReports: true }
                    })}
                    className={`py-2.5 px-4 rounded-xl text-sm font-semibold border text-center transition-all ${
                      formData.health.hasMedicalReports
                        ? 'bg-teal-50 border-teal-600 text-teal-900 ring-2 ring-teal-500/20'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      health: { ...formData.health, hasMedicalReports: false }
                    })}
                    className={`py-2.5 px-4 rounded-xl text-sm font-semibold border text-center transition-all ${
                      !formData.health.hasMedicalReports
                        ? 'bg-teal-50 border-teal-600 text-teal-900 ring-2 ring-teal-500/20'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Secure Reports File Upload (Conditional) */}
              {formData.health.hasMedicalReports && (
                <div className="space-y-3 p-5 rounded-2xl bg-teal-50/50 border border-teal-200/80">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-teal-950">Upload Medical Reports</h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Upload MRI, X-ray, or scan reports. Up to 5 files.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-teal-800 bg-white px-2.5 py-1 rounded-md border border-teal-200">
                      {formData.files.medicalReports.length} / 5 files
                    </span>
                  </div>

                  {/* Drop area */}
                  {formData.files.medicalReports.length < 5 && (
                    <label className="border-2 border-dashed border-teal-300 hover:border-teal-500 bg-white rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                      <Upload className="w-8 h-8 text-teal-600 group-hover:scale-110 transition-transform mb-2" />
                      <span className="text-xs font-bold text-slate-800">
                        Click to upload report files
                      </span>
                      <span className="text-[11px] text-slate-500 mt-1">
                        Accepted: PDF, JPG, JPEG, PNG (Max 1 GB per file note)
                      </span>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,image/jpeg,image/png,application/pdf"
                        onChange={handleReportsUpload}
                        className="hidden"
                      />
                    </label>
                  )}

                  {/* Uploaded files list */}
                  {formData.files.medicalReports.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-slate-700 block">Attached Files:</span>
                      {formData.files.medicalReports.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-xs"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                            <span className="font-medium text-slate-800 truncate max-w-[200px] sm:max-w-xs">
                              {file.name}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeReport(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-[11px] text-teal-800/80 flex items-center gap-1.5 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                    Medical documents are handled strictly for clinical assessment.
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  id="step2-next-btn"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-7 py-3 rounded-xl transition-all shadow-sm"
                >
                  <span>Continue to Preferred Time</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PREFERRED CONSULTATION TIME */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Step 3: Preferred Consultation Time</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your preferred time of day for the video session.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    id: 'Morning' as ConsultationTimeSlot,
                    title: 'Morning',
                    desc: '9:00 AM – 1:00 PM',
                    icon: '🌅',
                  },
                  {
                    id: 'Afternoon' as ConsultationTimeSlot,
                    title: 'Afternoon',
                    desc: '1:00 PM – 5:00 PM',
                    icon: '☀️',
                  },
                  {
                    id: 'Evening' as ConsultationTimeSlot,
                    title: 'Evening',
                    desc: '5:00 PM – 9:00 PM',
                    icon: '🌙',
                  },
                ].map((slot) => {
                  const isSelected = formData.schedule.preferredTime === slot.id;
                  return (
                    <div
                      key={slot.id}
                      onClick={() => setFormData({
                        ...formData,
                        schedule: { preferredTime: slot.id }
                      })}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-teal-50/80 border-teal-600 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{slot.icon}</div>
                      <h3 className="font-bold text-slate-900 text-base">{slot.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{slot.desc}</p>
                      
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className={isSelected ? 'text-teal-700 font-bold' : 'text-slate-400'}>
                          {isSelected ? 'Selected' : 'Select'}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <p>
                  Our clinic admin will confirm your exact consultation time slot based on clinical availability and contact you via WhatsApp / email with the video session link.
                </p>
              </div>

              {/* Navigation buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  id="step3-next-btn"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-7 py-3 rounded-xl transition-all shadow-sm"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PAYMENT */}
          {currentStep === 4 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Step 4: Payment Verification</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete the standard ₹{consultationFee} fee via PhonePe, Paytm, or Google Pay.
                </p>
              </div>

              {/* Fee Card */}
              <div className="p-5 rounded-2xl bg-teal-900 text-white space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-teal-300 font-bold block">
                      Consultation Service
                    </span>
                    <h3 className="text-lg font-bold">Online Physiotherapy Assessment</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-teal-300 block">Total Payable</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-white">₹{consultationFee}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-teal-800 text-xs text-teal-200 flex flex-wrap items-center justify-between gap-2">
                  <span>Supported Apps: PhonePe • Paytm • Google Pay</span>
                  <span className="bg-teal-800 px-2.5 py-1 rounded text-white font-mono">
                    Number: {paymentNumber}
                  </span>
                </div>
              </div>

              {/* Clinic Payment Number Box */}
              <div className="p-5 rounded-2xl bg-white border-2 border-teal-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">
                      Clinic UPI / Mobile Number:
                    </span>
                    <span className="text-2xl font-mono font-extrabold text-slate-900 tracking-wider">
                      {paymentNumber}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      id="copy-payment-number-btn"
                      onClick={copyPaymentNumber}
                      className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5 text-teal-700" />
                      <span>{copiedNumber ? 'Copied!' : 'Copy Number'}</span>
                    </button>

                    {/* UPI intent link for mobile phones */}
                    <a
                      href={`upi://pay?pa=${paymentNumber}@upi&pn=Kiva%20Physiotherapy%20Clinic&am=${consultationFee}&cu=INR`}
                      className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm"
                    >
                      <span>Pay ₹{consultationFee}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  Open <strong>PhonePe</strong>, <strong>Paytm</strong>, or <strong>Google Pay</strong> on your mobile device, enter <strong>{paymentNumber}</strong>, pay <strong>₹{consultationFee}</strong>, and upload the screenshot or transaction receipt below.
                </p>
              </div>

              {/* Upload Payment Screenshot */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Upload Payment Screenshot <span className="text-slate-400 font-normal">(Receipt / Proof)</span>
                </label>
                
                <label className="border-2 border-dashed border-slate-300 hover:border-teal-500 bg-slate-50 hover:bg-teal-50/20 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                  <CreditCard className="w-8 h-8 text-teal-600 group-hover:scale-110 transition-transform mb-2" />
                  
                  {formData.files.paymentScreenshot ? (
                    <div className="text-center space-y-1">
                      <span className="text-xs font-bold text-teal-800 flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Proof Attached: {formData.files.paymentScreenshot.name}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Click to replace file if needed
                      </span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-xs font-bold text-slate-800 block">
                        Click to select payment screenshot
                      </span>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        JPG, PNG, or PDF file from your phone
                      </span>
                    </div>
                  )}

                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,image/jpeg,image/png,application/pdf"
                    onChange={handleScreenshotUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Confirmation Checkbox */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    id="confirm-info-correct"
                    required
                    checked={formData.payment.confirmedCorrect}
                    onChange={(e) => setFormData({
                      ...formData,
                      payment: { ...formData.payment, confirmedCorrect: e.target.checked }
                    })}
                    className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 mt-0.5 accent-teal-600"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    <strong>I confirm that the information provided is correct.</strong> I understand that online consultation is for assessment and guidance and does not replace emergency medical care.
                  </span>
                </label>
              </div>

              {/* Navigation & Submit buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  id="submit-appointment-btn"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-bold text-base px-8 py-3.5 rounded-xl transition-all shadow-md shadow-teal-600/25"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-5 h-5" />
                      <span>Submit Appointment Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
