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

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [bookingReason, setBookingReason] = useState<string | undefined>(undefined);
  const [confirmedBookingData, setConfirmedBookingData] = useState<BookingSubmissionResponse | null>(null);

  // Sync with URL hash if present
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash) {
        // Strip out query params if any
        const cleanPage = hash.split('?')[0];
        setCurrentPage(cleanPage);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: string, params?: { reason?: string }) => {
    if (params?.reason) {
      setBookingReason(params.reason);
    }
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingSuccess = (result: BookingSubmissionResponse) => {
    setConfirmedBookingData(result);
    setCurrentPage('confirmation');
    window.location.hash = 'confirmation';
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
