import React from 'react';
import { CalendarCheck, MessageSquare } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

interface MobileBottomBarProps {
  onNavigate: (page: string, params?: { reason?: string }) => void;
  currentPage: string;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ onNavigate, currentPage }) => {
  const { whatsappUrl, settings } = useClinic();

  // Hide on admin routes, booking, or confirmation to keep form view clear and uncluttered
  if (
    currentPage.startsWith('admin') || 
    currentPage === 'appointments' || 
    currentPage === 'booking' ||
    currentPage === 'confirmation'
  ) {
    return null;
  }

  return (
    <div 
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      <div className="grid grid-cols-2 gap-2.5 max-w-md mx-auto">
        <button
          id="mobile-sticky-book-btn"
          onClick={() => onNavigate('appointments')}
          className="flex items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-xs transition-transform active:scale-98"
        >
          <CalendarCheck className="w-4 h-4 shrink-0" />
          <span>Book Appointment</span>
        </button>

        <a
          id="mobile-sticky-whatsapp-btn"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-xs transition-transform active:scale-98"
        >
          <MessageSquare className="w-4 h-4 shrink-0" />
          <span>WhatsApp Us</span>
        </a>
      </div>
    </div>
  );
};
