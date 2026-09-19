import React from 'react';
import { ClipboardCheck, UserCheck, Video, HeartHandshake } from 'lucide-react';

export const TrustCards: React.FC = () => {
  const cards = [
    {
      icon: ClipboardCheck,
      title: 'Detailed Assessment',
      description: 'Understand your concerns through a structured consultation.',
      accent: 'teal'
    },
    {
      icon: UserCheck,
      title: 'Personalized Guidance',
      description: 'Advice based on the information discussed during your consultation.',
      accent: 'emerald'
    },
    {
      icon: Video,
      title: 'Online Convenience',
      description: 'Consult from wherever you are.',
      accent: 'teal'
    },
    {
      icon: HeartHandshake,
      title: 'Patient-Centered Approach',
      description: 'A consultation experience designed around your individual concerns.',
      accent: 'emerald'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-12">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold uppercase tracking-wider">
          Professional Standard
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Why Patients Choose Professional Physiotherapy Care
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Structured, evidence-informed consultation that puts your personal mobility and comfort first.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-teal-300 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="space-y-3.5">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300 shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-900 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {card.description}
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-slate-100 flex items-center gap-1 text-[11px] font-semibold text-teal-700">
                <span>Clinical Standard</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
