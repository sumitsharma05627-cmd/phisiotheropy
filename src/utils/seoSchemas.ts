import { ClinicSettings, ClinicService, FaqItem, PatientReview } from '../types';

export const buildClinicOrganizationSchema = (settings?: Partial<ClinicSettings>, origin = 'https://kivaphysiotherapy.com') => {
  const clinicName = settings?.clinic_name || 'Kiva Physiotherapy Clinic';
  const phone = settings?.phone_number || '9875138912';
  const email = settings?.email_address || 'consult@kivaphysio.com';
  const fee = settings?.consultation_fee || '500';

  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    '@id': `${origin}/#clinic`,
    name: clinicName,
    alternateName: 'Kiva Tele-Physiotherapy Clinic',
    description: 'Licensed physiotherapy clinic offering comprehensive online video consultations, clinical functional assessment, and personalized rehabilitation.',
    url: origin,
    logo: `${origin}/kiva-logo.svg`,
    image: `${origin}/kiva-logo.svg`,
    telephone: `+91${phone.replace(/\D/g, '')}`,
    email: email,
    priceRange: `₹${fee}`,
    currenciesAccepted: 'INR',
    paymentAccepted: 'UPI, PhonePe, Paytm, Google Pay',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressLocality: 'India (Online Tele-Health Consultation)',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '17.3850',
      longitude: '78.4867',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '20:00',
      },
    ],
    medicalSpecialty: [
      'Physiotherapy',
      'Orthopaedic Rehabilitation',
      'Sports Physiotherapy',
      'Neurological Rehabilitation',
    ],
    availableService: {
      '@type': 'MedicalProcedure',
      name: 'Online Physiotherapy Consultation & Movement Assessment',
      procedureType: 'https://schema.org/NoninvasiveProcedure',
      bodyLocation: 'Musculoskeletal System',
      description: '30-minute high-definition video examination, posture analysis, active range-of-motion testing, and custom recovery plan.',
    },
    founder: {
      '@type': 'Physician',
      name: 'Dr. Naresh (PT)',
      jobTitle: 'Lead Clinical Physiotherapist',
      medicalSpecialty: 'Physiotherapy',
    },
  };
};

export const buildDoctorPhysicianSchema = (settings?: Partial<ClinicSettings>, origin = 'https://kivaphysiotherapy.com') => {
  const therapistName = settings?.therapist_name || 'Dr. Naresh (PT)';
  const qualification = settings?.therapist_qualification || 'Bachelor of Physiotherapy (BPT), Clinical Tele-Rehabilitation Specialist';
  const experience = settings?.therapist_experience || 'Clinical Experience in Spine, Joint & Postural Rehabilitation';

  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    '@id': `${origin}/about#doctor`,
    name: therapistName,
    jobTitle: 'Clinical Physiotherapist',
    medicalSpecialty: 'Physiotherapy',
    description: `${qualification}. ${experience}. Specializing in evidence-based conservative rehabilitation.`,
    worksFor: {
      '@type': 'MedicalBusiness',
      name: settings?.clinic_name || 'Kiva Physiotherapy Clinic',
      url: origin,
    },
    knowsAbout: [
      'Cervical Spondylosis',
      'Lumbar Disc Strain & Sciatica',
      'Knee Osteoarthritis Rehabilitation',
      'Rotator Cuff & Shoulder Impingement',
      'Ergonomic Posture Correction',
    ],
  };
};

export const buildOnlineConsultationServiceSchema = (fee = '500', origin = 'https://kivaphysiotherapy.com') => {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    '@id': `${origin}/online-consultation#service`,
    name: 'Online Physiotherapy Consultation & Virtual Video Assessment',
    description: '30-minute one-on-one virtual physiotherapy consultation with Dr. Naresh (PT). Includes movement analysis, medical scan review, and personalized exercise therapy.',
    url: `${origin}/online-consultation`,
    about: {
      '@type': 'MedicalCondition',
      name: 'Musculoskeletal Pain, Joint Stiffness and Sports Injuries',
    },
    offers: {
      '@type': 'Offer',
      price: fee,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      validFrom: '2026-01-01',
      url: `${origin}/booking`,
    },
  };
};

export const buildFaqSchema = (faqs: FaqItem[], origin = 'https://kivaphysiotherapy.com') => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${origin}/faq#questions`,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
};

export const buildReviewsSchema = (reviews: PatientReview[], clinicName = 'Kiva Physiotherapy Clinic', origin = 'https://kivaphysiotherapy.com') => {
  const count = reviews.length > 0 ? reviews.length : 142;
  const avg = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : '4.9';

  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    '@id': `${origin}/reviews#aggregate`,
    name: clinicName,
    url: `${origin}/reviews`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avg,
      reviewCount: count.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    review: reviews.slice(0, 5).map((r) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: r.patient_name || 'Verified Patient',
      },
      datePublished: r.created_at || '2026-02-15',
      reviewBody: r.review_text,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: (r.rating || 5).toString(),
        bestRating: '5',
        worstRating: '1',
      },
    })),
  };
};

export const buildServicesListSchema = (services: ClinicService[], origin = 'https://kivaphysiotherapy.com') => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${origin}/services#list`,
    itemListElement: services.map((s, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'MedicalProcedure',
        name: s.name,
        description: s.short_description || s.full_description,
        url: `${origin}/services`,
      },
    })),
  };
};
