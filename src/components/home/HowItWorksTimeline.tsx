import React from 'react';
import { CalendarCheck, MessageSquare, Video, FileCheck, ArrowRight } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

interface HowItWorksTimelineProps {
  onNavigate: (page: string) => void;
}

export const HowItWorksTimeline: React.FC<HowItWorksTimelineProps> = ({ onNavigate }) => {
  const { settings } = useClinic();
  const fee = settings.consultation_fee || '500';

  const steps = [
    {
      step: '01',
      title: 'Book Appointment',
      icon: CalendarCheck,
      desc: `Choose your preferred date, convenient morning or evening time slot, and submit the standard fee (₹${fee}).`,
      highlight: 'Quick & Transparent'
    },
    {
      step: '02',
      title: 'Share Your Concern',
      icon: MessageSquare,
      desc: 'Describe your pain location, symptoms, duration, and optionally upload past MRI, X-ray, or medical reports.',
      highlight: 'Secure & Confidential'
    },
    {
      step: '03',
      title: 'Consult With the Physiotherapist',
      icon: Video,
      desc: 'Connect via a secure 1-on-1 video call for active range of motion assessment and biomechanical observation.',
      highlight: 'Comprehensive HD Session'
    },
    {
      step: '04',
      title: 'Receive Professional Guidance',
      icon: FileCheck,
      desc: 'Get a clear explanation of observed movement patterns, tailored rehabilitation exercises, and home care advice.',
      highlight: 'Personalized Recovery'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-14">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold uppercase tracking-wider">
          Seamless Process
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          How Online Physiotherapy Works
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          From your initial consultation request to live movement assessment, we make quality physical rehabilitation straightforward.
        </p>
      </div>

      {/* Steps Container with connecting line */}
      <div className="relative">
        
        {/* Subtle Animated Progress Line (Desktop) */}
        <div 
          className="hidden lg:block absolute top-1/2 left-8 right-8 -translate-y-6 h-0.5 bg-gradient-to-r from-teal-200 via-teal-500 to-emerald-300 z-0 opacity-70"
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-teal-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Step Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold group-hover:bg-teal-600 group-hover:text-white transition-colors shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-extrabold text-teal-800 bg-teal-50/80 px-2.5 py-1 rounded-lg border border-teal-100">
                      Step {item.step}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-900 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-teal-700">{item.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <div className="text-center pt-10">
        <button
          onClick={() => onNavigate('appointments')}
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-sm transition-all hover:-translate-y-0.5"
        >
          <span>Start Step 01: Book Appointment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
