import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Menu, 
  X, 
  Phone, 
  CalendarCheck, 
  UserCheck,
  Search,
  MessageSquare,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: { reason?: string }) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesExpanded, setMobileServicesExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { settings, services, whatsappUrl } = useClinic();

  const consultationFee = settings.consultation_fee || '500';
  const phoneNumber = settings.phone_number || '9875138912';

  // Detect window scroll for dynamic navbar sizing and backdrop
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (pageId: string, params?: { reason?: string }) => {
    onNavigate(pageId, params);
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  };

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setServicesDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setServicesDropdownOpen(false);
    }, 200);
  };

  // Nav links strictly according to specification:
  // Home, About, Services, Gallery, Reviews, FAQ, Contact
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services', isDropdown: true },
    { id: 'gallery', label: 'Gallery' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
  ];

  // Active check helper
  const isPageActive = (linkId: string) => {
    if (linkId === 'home') return currentPage === 'home' || currentPage === '';
    if (linkId === 'services') return currentPage === 'services' || currentPage === 'service';
    return currentPage === linkId;
  };

  // Display services for dropdown (fallback to standard clinical services if none configured)
  const displayServices = services && services.length > 0 ? services.slice(0, 6) : [
    { id: 1, name: 'Back and Neck Pain Management', short_description: 'Targeted spine assessment & relief' },
    { id: 2, name: 'Joint and Knee Rehabilitation', short_description: 'Mobility & joint functional restoration' },
    { id: 3, name: 'Post-Surgical Rehabilitation', short_description: 'Guided progressive orthopedic recovery' },
    { id: 4, name: 'Postural & Ergonomic Correction', short_description: 'Desk posture & biomechanics analysis' },
    { id: 5, name: 'Sports Injury Recovery', short_description: 'Strains, sprains & safe return to sport' },
    { id: 6, name: 'Geriatric Mobility & Balance', short_description: 'Safe low-impact strength & stability' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80'
            : 'bg-white border-b border-slate-200'
        }`}
      >
        {/* Top Clinical Utility Bar - smoothly shrinks when scrolled */}
        <div 
          className={`bg-teal-950 text-teal-100 text-xs px-4 border-b border-teal-900/40 transition-all duration-300 ${
            isScrolled ? 'py-1 text-[11px]' : 'py-1.5'
          }`}
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1.5">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <span className="inline-flex items-center justify-center bg-teal-800/90 text-teal-200 text-[10px] sm:text-[11px] rounded px-2 py-0.5 font-semibold tracking-wide uppercase">
                Notice
              </span>
              <span className="text-teal-100 font-medium truncate max-w-xl text-[11px] sm:text-xs">
                {settings.announcement_banner || 'Accepting online functional assessment & video consultation requests.'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs shrink-0">
              <button
                onClick={() => handleNavClick('booking-status')}
                className="flex items-center gap-1 text-teal-300 hover:text-white transition-colors"
              >
                <Search className="w-3 h-3 text-teal-400" />
                <span>Track Status</span>
              </button>
              <span className="text-teal-800">|</span>
              <a 
                href={`tel:${phoneNumber}`} 
                className="flex items-center gap-1 hover:text-white transition-colors font-medium text-teal-200"
              >
                <Phone className="w-3 h-3 text-teal-400" />
                <span>{phoneNumber}</span>
              </a>
              <span className="text-teal-800">|</span>
              <button
                id="nav-admin-link"
                onClick={() => handleNavClick('admin')}
                className="flex items-center gap-1 hover:text-white transition-colors text-teal-300"
              >
                <UserCheck className="w-3 h-3" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Sticky Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className={`flex items-center justify-between transition-all duration-300 ${
              isScrolled ? 'h-16' : 'h-20'
            }`}
          >
            
            {/* LEFT: Clinic logo & name */}
            <div 
              id="nav-logo-btn"
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none shrink-0 min-w-0"
            >
              {/* Official circular emblem logo: never stretches or distorts */}
              <div className={`relative aspect-square rounded-full overflow-hidden shrink-0 border border-teal-900/10 shadow-xs group-hover:shadow-sm transition-all duration-300 ${
                isScrolled ? 'w-9 h-9 sm:w-10 sm:h-10' : 'w-10 h-10 sm:w-12 sm:h-12'
              }`}>
                <img
                  src="/kiva-logo.svg"
                  alt="Kiva Physiotherapy Clinic Logo"
                  className="w-full h-full object-contain aspect-square block group-hover:scale-105 transition-transform duration-300"
                  loading="eager"
                  decoding="async"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`block font-extrabold tracking-tight text-slate-900 group-hover:text-teal-700 transition-all truncate leading-tight ${
                    isScrolled ? 'text-sm sm:text-base lg:text-lg' : 'text-base sm:text-lg lg:text-xl'
                  }`}>
                    {settings.clinic_name || 'Kiva Physiotherapy Clinic'}
                  </span>
                </div>
                <span className="hidden sm:block text-[10px] sm:text-[11px] font-semibold text-teal-700 tracking-wide uppercase truncate">
                  Physiotherapy & Tele-Rehab • ₹{consultationFee}
                </span>
                <span className="sm:hidden text-[10px] font-semibold text-teal-700 tracking-wide uppercase truncate block">
                  Dr. Naresh (PT)
                </span>
              </div>
            </div>

            {/* CENTER: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isPageActive(link.id);

                if (link.isDropdown) {
                  return (
                    <div 
                      key={link.id} 
                      className="relative" 
                      ref={dropdownRef}
                      onMouseEnter={handleDropdownEnter}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <button
                        id="nav-services-dropdown-btn"
                        onClick={() => handleNavClick('services')}
                        className={`relative px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap ${
                          active
                            ? 'text-teal-800 font-bold bg-teal-50/70'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                        }`}
                        aria-expanded={servicesDropdownOpen}
                      >
                        <span>{link.label}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          servicesDropdownOpen ? 'rotate-180 text-teal-700' : 'text-slate-400'
                        }`} />
                        {active && (
                          <span className="absolute bottom-0.5 left-3.5 right-3.5 h-0.5 bg-teal-600 rounded-full" />
                        )}
                      </button>

                      {/* Dropdown Menu Panel */}
                      {servicesDropdownOpen && (
                        <div className="absolute top-full left-0 w-80 pt-2 z-50">
                          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                            <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Clinical Treatments
                              </span>
                              <span className="text-[11px] font-semibold text-teal-700">
                                ₹{consultationFee} Consultation
                              </span>
                            </div>

                            <div className="py-1 space-y-0.5 max-h-[320px] overflow-y-auto">
                              {displayServices.map((service) => (
                                <button
                                  key={service.id}
                                  onClick={() => handleNavClick('appointments', { reason: service.name })}
                                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-teal-50/80 group transition-colors flex items-start gap-2.5"
                                >
                                  <div className="w-7 h-7 rounded-lg bg-teal-100/70 text-teal-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                    <Stethoscope className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <span className="text-xs font-bold text-slate-800 group-hover:text-teal-900 block truncate">
                                      {service.name}
                                    </span>
                                    <span className="text-[11px] text-slate-500 line-clamp-1">
                                      {service.short_description}
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </div>

                            {/* View All Services Link */}
                            <div className="pt-2 border-t border-slate-100 px-1">
                              <button
                                onClick={() => handleNavClick('services')}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-teal-700 hover:bg-teal-50 transition-colors"
                              >
                                <span>View All Services</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={link.id}
                    id={`nav-link-${link.id}`}
                    onClick={() => handleNavClick(link.id)}
                    className={`relative px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                      active
                        ? 'text-teal-800 font-bold bg-teal-50/70'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                  >
                    <span>{link.label}</span>
                    {active && (
                      <span className="absolute bottom-0.5 left-3.5 right-3.5 h-0.5 bg-teal-600 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* RIGHT: WhatsApp icon/button & "Book Appointment" CTA */}
            <div className="hidden sm:flex items-center gap-2.5">
              <a
                id="header-whatsapp-cta"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 text-sm font-semibold px-3 py-2 rounded-xl border border-slate-200 transition-colors"
                title="Chat with Kiva Physiotherapy Clinic on WhatsApp"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span className="hidden xl:inline">WhatsApp</span>
              </a>

              <button
                id="header-book-cta"
                onClick={() => handleNavClick('appointments')}
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4.5 py-2.5 rounded-xl shadow-sm shadow-teal-600/25 transition-all hover:shadow hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>
            </div>

            {/* Mobile hamburger button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                id="mobile-book-header-compact-btn"
                onClick={() => handleNavClick('appointments')}
                className="sm:hidden inline-flex items-center gap-1 bg-teal-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Book</span>
              </button>

              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE NAVIGATION DRAWER / MODAL */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-h-[90vh] flex flex-col rounded-b-3xl shadow-2xl border-b border-slate-200 overflow-hidden animate-in slide-in-from-top duration-300">
            
            {/* Header in Drawer */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden aspect-square shrink-0 border border-slate-200 shadow-xs">
                  <img
                    src="/kiva-logo.svg"
                    alt="Kiva Physiotherapy Clinic Logo"
                    className="w-full h-full object-contain aspect-square block"
                  />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 text-sm block">
                    {settings.clinic_name || 'Kiva Physiotherapy Clinic'}
                  </span>
                  <span className="text-[11px] text-teal-700 font-semibold">
                    Dr. Naresh (PT) • Fee: ₹{consultationFee}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Nav links scroll area */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
              {/* Home */}
              <button
                onClick={() => handleNavClick('home')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
                  isPageActive('home') ? 'bg-teal-50 text-teal-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Home</span>
                {isPageActive('home') && <div className="w-2 h-2 rounded-full bg-teal-600" />}
              </button>

              {/* About */}
              <button
                onClick={() => handleNavClick('about')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
                  isPageActive('about') ? 'bg-teal-50 text-teal-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>About</span>
                {isPageActive('about') && <div className="w-2 h-2 rounded-full bg-teal-600" />}
              </button>

              {/* Services with expandable Accordion on mobile */}
              <div className="border border-slate-100 rounded-xl overflow-hidden my-1">
                <div className="flex items-center justify-between bg-slate-50/70 pr-2">
                  <button
                    onClick={() => handleNavClick('services')}
                    className={`flex-1 text-left px-3.5 py-2.5 text-sm font-semibold ${
                      isPageActive('services') ? 'text-teal-800 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <span>Services</span>
                  </button>
                  <button
                    onClick={() => setMobileServicesExpanded(!mobileServicesExpanded)}
                    className="p-2 text-slate-500 hover:text-slate-800"
                    aria-label="Expand services accordion"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                      mobileServicesExpanded ? 'rotate-180 text-teal-700' : ''
                    }`} />
                  </button>
                </div>

                {mobileServicesExpanded && (
                  <div className="p-2 bg-white space-y-1 border-t border-slate-100">
                    {displayServices.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => handleNavClick('appointments', { reason: service.name })}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-teal-50 flex items-center justify-between text-slate-700 hover:text-teal-900"
                      >
                        <span className="truncate">{service.name}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                      </button>
                    ))}
                    <button
                      onClick={() => handleNavClick('services')}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-teal-700 hover:underline flex items-center gap-1 pt-1"
                    >
                      <span>View All Services →</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Online Consultation */}
              <button
                onClick={() => handleNavClick('online-consultation')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
                  isPageActive('online-consultation') ? 'bg-teal-50 text-teal-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Online Consultation</span>
                {isPageActive('online-consultation') && <div className="w-2 h-2 rounded-full bg-teal-600" />}
              </button>

              {/* Gallery */}
              <button
                onClick={() => handleNavClick('gallery')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
                  isPageActive('gallery') ? 'bg-teal-50 text-teal-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Gallery</span>
                {isPageActive('gallery') && <div className="w-2 h-2 rounded-full bg-teal-600" />}
              </button>

              {/* Reviews */}
              <button
                onClick={() => handleNavClick('reviews')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
                  isPageActive('reviews') ? 'bg-teal-50 text-teal-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Reviews</span>
                {isPageActive('reviews') && <div className="w-2 h-2 rounded-full bg-teal-600" />}
              </button>

              {/* FAQ */}
              <button
                onClick={() => handleNavClick('faq')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
                  isPageActive('faq') ? 'bg-teal-50 text-teal-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>FAQ</span>
                {isPageActive('faq') && <div className="w-2 h-2 rounded-full bg-teal-600" />}
              </button>

              {/* Contact */}
              <button
                onClick={() => handleNavClick('contact')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
                  isPageActive('contact') ? 'bg-teal-50 text-teal-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Contact</span>
                {isPageActive('contact') && <div className="w-2 h-2 rounded-full bg-teal-600" />}
              </button>
            </div>

            {/* Bottom Actions in Drawer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/80 space-y-2.5">
              <button
                id="mobile-menu-book-btn"
                onClick={() => handleNavClick('appointments')}
                className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm text-sm"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>

              <a
                id="mobile-menu-whatsapp-btn"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-xs text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                <button
                  onClick={() => handleNavClick('booking-status')}
                  className="text-teal-700 font-medium hover:underline flex items-center gap-1"
                >
                  <Search className="w-3 h-3" />
                  <span>Track Status</span>
                </button>

                <button
                  onClick={() => handleNavClick('admin')}
                  className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
                >
                  <UserCheck className="w-3 h-3" />
                  <span>Admin Portal</span>
                </button>
              </div>
            </div>

          </div>
          
          {/* Backdrop click to close */}
          <div 
            className="flex-1 cursor-pointer" 
            onClick={() => setMobileMenuOpen(false)} 
          />
        </div>
      )}
    </>
  );
};
