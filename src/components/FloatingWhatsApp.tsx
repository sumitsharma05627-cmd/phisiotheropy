import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const FloatingWhatsApp: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { settings } = useClinic();

  const cleanNumber = (settings.whatsapp_number || '9875138912').replace(/\D/g, '');
  const finalNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;
  
  const prefilledMessage = encodeURIComponent(
    'Hello Kiva Physiotherapy Clinic, I would like to know more about physiotherapy consultation.'
  );
  const whatsappUrl = `https://wa.me/${finalNumber}?text=${prefilledMessage}`;

  return (
    <aside 
      aria-label="WhatsApp Support"
      className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex items-center pointer-events-auto"
    >
      {/* Desktop Hover Label */}
      <div 
        className={`hidden md:flex items-center mr-3 bg-white text-slate-800 text-xs font-semibold py-2 px-3.5 rounded-full shadow-lg border border-slate-200/80 transition-all duration-200 pointer-events-none ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        <span>Chat with Kiva Physiotherapy Clinic</span>
      </div>

      {/* Floating Button */}
      <a
        id="floating-whatsapp-btn"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-full shadow-lg shadow-emerald-700/25 transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
        aria-label="Chat with Kiva Physiotherapy Clinic on WhatsApp"
        title="Chat with Kiva Physiotherapy Clinic"
      >
        <span className="sr-only">Chat with Kiva Physiotherapy Clinic</span>
        {/* Subtle breathing ripple */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500 opacity-20 group-hover:opacity-40 animate-pulse pointer-events-none" />
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 relative fill-current" />
      </a>
    </aside>
  );
};
