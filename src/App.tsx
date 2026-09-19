import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { MobileBottomBar } from './components/MobileBottomBar';
import { ScrollProgress } from './components/ScrollProgress';
import { ClinicProvider } from './context/ClinicContext';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { OnlineConsultationPage } from './pages/OnlineConsultationPage';
import { GalleryPage } from './pages/GalleryPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { BookingPage } from './pages/BookingPage';
import { BookingConfirmationPage } from './pages/BookingConfirmationPage';
import { BookingStatusPage } from './pages/BookingStatusPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsDisclaimerPage } from './pages/TermsDisclaimerPage';
import { MedicalDisclaimerPage } from './pages/MedicalDisclaimerPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

import { BookingSubmissionResponse } from './types';

const VALID_ROUTES = new Set([
  'home',
  'about',
  'services',
  'service',
  'online-consultation',
  'gallery',
  'reviews',
  'faq',
  'contact',
  'booking',
  'appointments',
  'confirmation',
  'status',
  'booking-status',
  'privacy',
  'privacy-policy',
  'terms',
  'disclaimer',
  'admin',
]);

function parseRouteFromLocation(): string {
  if (typeof window === 'undefined') return 'home';

  // 1. Check hash if explicitly provided (#/services, #services)
  const hash = window.location.hash.replace(/^#\/?/, '').trim();
  if (hash) {
    const cleanHash = hash.split('?')[0].toLowerCase();
    if (VALID_ROUTES.has(cleanHash)) {
      return cleanHash;
    }
  }

  // 2. Check pathname (/admin, /services, /about, etc.)
  const pathname = window.location.pathname.replace(/^\//, '').replace(/\/$/, '').trim();
  if (pathname) {
    const cleanPath = pathname.split('?')[0].toLowerCase();
    if (VALID_ROUTES.has(cleanPath)) {
      return cleanPath;
    }
  }

  return 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>(parseRouteFromLocation);
  const [bookingReason, setBookingReason] = useState<string | undefined>(undefined);
  const [confirmedBookingData, setConfirmedBookingData] = useState<BookingSubmissionResponse | null>(null);

  // Sync with browser URL changes (pathname or hash, browser back/forward)
  useEffect(() => {
    const handleLocationChange = () => {
      const page = parseRouteFromLocation();
      setCurrentPage(page);
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleNavigate = (page: string, params?: { reason?: string }) => {
    if (params?.reason) {
      setBookingReason(params.reason);
    }
    setCurrentPage(page);
    const targetUrl = page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ page }, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingSuccess = (result: BookingSubmissionResponse) => {
    setConfirmedBookingData(result);
    setCurrentPage('confirmation');
    if (window.location.pathname !== '/confirmation') {
      window.history.pushState({ page: 'confirmation' }, '', '/confirmation');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ClinicProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-teal-100 selection:text-teal-900">
        
        {/* Requirement 18: Very thin scroll-progress indicator */}
        <ScrollProgress />

        {/* Top Navigation */}
        <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

        {/* Main Content Area with fast, smooth page transitions */}
        <main key={currentPage} className="flex-1 pb-20 md:pb-0 animate-in fade-in duration-200">
          {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
          {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
          {currentPage === 'services' && <ServicesPage onNavigate={handleNavigate} />}
          {(currentPage === 'service' || currentPage === 'online-consultation') && (
            <OnlineConsultationPage onNavigate={handleNavigate} />
          )}
          {currentPage === 'gallery' && <GalleryPage onNavigate={handleNavigate} />}
          {currentPage === 'reviews' && <ReviewsPage onNavigate={handleNavigate} />}
          {currentPage === 'faq' && <FaqPage onNavigate={handleNavigate} />}
          {currentPage === 'contact' && <ContactPage onNavigate={handleNavigate} />}
          
          {(currentPage === 'booking' || currentPage === 'appointments') && (
            <BookingPage 
              initialReason={bookingReason} 
              onSuccess={handleBookingSuccess} 
              onNavigate={handleNavigate} 
            />
          )}

          {currentPage === 'confirmation' && confirmedBookingData && (
            <BookingConfirmationPage
              bookingData={confirmedBookingData}
              onNavigate={handleNavigate}
            />
          )}
          {currentPage === 'confirmation' && !confirmedBookingData && (
            <BookingStatusPage onNavigate={handleNavigate} />
          )}
          {(currentPage === 'status' || currentPage === 'booking-status') && (
            <BookingStatusPage onNavigate={handleNavigate} />
          )}

          {(currentPage === 'privacy' || currentPage === 'privacy-policy') && <PrivacyPolicyPage />}
          {currentPage === 'terms' && <TermsDisclaimerPage />}
          {currentPage === 'disclaimer' && <MedicalDisclaimerPage onNavigate={handleNavigate} />}
          {currentPage === 'admin' && <AdminDashboardPage />}
        </main>

        {/* Footer */}
        <Footer onNavigate={handleNavigate} />

        {/* Sticky Mobile Bottom Quick Bar */}
        <MobileBottomBar onNavigate={handleNavigate} currentPage={currentPage} />

        {/* Persistent Floating WhatsApp Callout (Desktop + Tablet) */}
        <FloatingWhatsApp />

      </div>
    </ClinicProvider>
  );
}
