import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClinicSettings, ClinicService, GalleryImage, PatientReview, FaqItem, PublicContentResponse } from '../types';

interface ClinicContextType {
  settings: ClinicSettings;
  services: ClinicService[];
  featuredGallery: GalleryImage[];
  featuredReviews: PatientReview[];
  faqs: FaqItem[];
  loading: boolean;
  refreshContent: () => Promise<void>;
  whatsappUrl: string;
}

const defaultSettings: ClinicSettings = {
  clinic_name: 'Kiva Physiotherapy Clinic',
  tagline: 'Move Better. Recover Better. Live Better.',
  hero_headline: 'Move Better. Recover Better. Live Better.',
  hero_description: 'Professional physiotherapy consultation and personalized guidance designed around your individual needs.',
  hero_image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
  whatsapp_number: '9875138912',
  phone_number: '9875138912',
  email_address: 'consult@kivaphysio.com',
  consultation_fee: '500',
  payment_number: '9875138912',
  payment_methods: 'PhonePe, Paytm, Google Pay',
  opening_hours: 'Monday – Saturday: 9:00 AM – 8:00 PM (IST)',
  address: 'Tele-Rehabilitation & Online Virtual Clinic',
  announcement_banner: 'Accepting appointments for comprehensive online assessments and structured video rehabilitation.',
  about_intro: 'Kiva Physiotherapy Clinic delivers patient-centered functional evaluation, evidence-based pain management guidance, and personalized physical rehabilitation plans via high-definition video consultations.',
  about_approach: 'Our approach combines in-depth movement observation, ergonomic lifestyle analysis, guided therapeutic exercises, and routine symptom tracking to support recovery and long-term joint health.',
};

const ClinicContext = createContext<ClinicContextType>({
  settings: defaultSettings,
  services: [],
  featuredGallery: [],
  featuredReviews: [],
  faqs: [],
  loading: true,
  refreshContent: async () => {},
  whatsappUrl: 'https://wa.me/919875138912',
});

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<PublicContentResponse>({
    settings: defaultSettings,
    services: [],
    featuredGallery: [],
    featuredReviews: [],
    faqs: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/public/content');
      if (res.ok) {
        const data = await res.json();
        setContent({
          settings: { ...defaultSettings, ...data.settings },
          services: data.services || [],
          featuredGallery: data.featuredGallery || [],
          featuredReviews: data.featuredReviews || [],
          faqs: data.faqs || [],
        });
      }
    } catch (err) {
      console.warn('Failed to fetch clinic public content, using defaults:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const cleanWhatsApp = (content.settings.whatsapp_number || '9875138912').replace(/\D/g, '');
  const finalWhatsApp = cleanWhatsApp.length === 10 ? `91${cleanWhatsApp}` : cleanWhatsApp;
  const whatsappUrl = `https://wa.me/${finalWhatsApp}?text=${encodeURIComponent(
    'Hello Kiva Physiotherapy Clinic, I would like to inquire about an appointment.'
  )}`;

  return (
    <ClinicContext.Provider
      value={{
        settings: content.settings,
        services: content.services,
        featuredGallery: content.featuredGallery,
        featuredReviews: content.featuredReviews,
        faqs: content.faqs,
        loading,
        refreshContent: fetchContent,
        whatsappUrl,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => useContext(ClinicContext);
