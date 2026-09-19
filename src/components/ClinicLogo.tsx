import React from 'react';

interface ClinicLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  imgClassName?: string;
  showText?: boolean;
  textVariant?: 'light' | 'dark';
  subtitle?: string;
}

export const ClinicLogo: React.FC<ClinicLogoProps> = ({
  size = 'md',
  className = '',
  imgClassName = '',
  showText = false,
  textVariant = 'dark',
  subtitle
}) => {
  // Pre-calculated square sizes in pixels & Tailwind classes
  const sizeMap: Record<string, { dim: string; px: number }> = {
    xs: { dim: 'w-7 h-7', px: 28 },
    sm: { dim: 'w-9 h-9', px: 36 },
    md: { dim: 'w-11 h-11 sm:w-12 sm:h-12', px: 48 },
    lg: { dim: 'w-14 h-14 sm:w-16 sm:h-16', px: 64 },
    xl: { dim: 'w-20 h-20 sm:w-24 sm:h-24', px: 80 }
  };

  const isNamedSize = typeof size === 'string' && sizeMap[size];
  const dimensionClass = isNamedSize ? sizeMap[size].dim : '';
  const inlineStyle = typeof size === 'number' ? { width: size, height: size } : undefined;

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* 
        The circular emblem logo:
        Guaranteed aspect-ratio 1:1, object-contain, shrink-0 to prevent any stretching or distortion 
      */}
      <div 
        className={`relative aspect-square shrink-0 rounded-full overflow-hidden shadow-xs hover:shadow-sm transition-transform duration-200 ${dimensionClass}`}
        style={inlineStyle}
      >
        <img
          src="/kiva-logo.svg"
          alt="Kiva Physiotherapy Clinic Logo - Dr. Naresh (PT)"
          className={`w-full h-full object-contain aspect-square block ${imgClassName}`}
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Optional branded typography beside the emblem */}
      {showText && (
        <div className="flex flex-col justify-center leading-tight">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span 
              className={`font-black tracking-tight text-base sm:text-lg lg:text-xl ${
                textVariant === 'light' ? 'text-white' : 'text-slate-900'
              }`}
            >
              KIVA
            </span>
            <span className="font-bold text-[10px] sm:text-xs tracking-wider uppercase text-emerald-600">
              PHYSIOTHERAPY CLINIC
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 mt-0.5">
            <span 
              className={`text-[11px] sm:text-xs font-semibold ${
                textVariant === 'light' ? 'text-emerald-400' : 'text-teal-800'
              }`}
            >
              {subtitle || 'Dr. Naresh (PT) • Move Better'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
