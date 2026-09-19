import React, { useState } from 'react';
import { 
  Search, 
  Eye, 
  BookOpen, 
  RotateCw, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const EducationalJourney: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 'problem',
      number: '01',
      title: 'Understanding the Problem',
      icon: Search,
      badge: 'Step 1: Listening & History',
      description: 'Listening to your symptoms, onset of discomfort, daily movements that trigger discomfort, and past medical history.',
      details: [
        'Detailed analysis of symptom timeline and severity',
        'Discussion of posture, work setup, and movement habits',
        'Review of any previous imaging or specialist notes'
      ],
      insight: 'Effective care begins with asking the right questions rather than making assumptions.'
    },
    {
      id: 'assessment',
      number: '02',
      title: 'Assessment',
      icon: Eye,
      badge: 'Step 2: Movement & Mechanics',
      description: 'Systematic observation of your active joint motion, range, movement limitations, and biomechanical compensation patterns.',
      details: [
        'Guided active movement tests performed on video',
        'Functional task evaluation (sitting, bending, walking)',
        'Observation of joint symmetry and postural compensation'
      ],
      insight: 'Real-time functional movement analysis reveals which tissues or muscle groups need support.'
    },
    {
      id: 'guidance',
      number: '03',
      title: 'Professional Guidance',
      icon: BookOpen,
      badge: 'Step 3: Tailored Plan',
      description: 'Clear, individualized guidance including targeted corrective exercises, ergonomic adjustments, and activity pacing.',
      details: [
        'Demonstration of safe, low-load rehabilitative movements',
        'Practical ergonomic adaptations for work and sleep',
        'Clear dos and don’ts to avoid aggravating symptoms'
      ],
      insight: 'You receive structured, easy-to-follow exercises customized to your current tolerance level.'
    },
    {
      id: 'followup',
      number: '04',
      title: 'Follow-up',
      icon: RotateCw,
      badge: 'Step 4: Adaptation & Progression',
      description: 'Reviewing your progression, adapting movement difficulty as tissues adapt, and addressing any questions during recovery.',
      details: [
        'Evaluating changes in movement ease and daily comfort',
        'Gradual progression of exercise load and intensity',
        'Long-term movement habits for joint health and resilience'
      ],
      insight: 'Rehabilitation is an ongoing, adaptive progression tailored to your pace.'
    }
  ];

  return (
    <section className="bg-slate-100/70 py-16 sm:py-20 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/90 text-teal-800 text-xs font-bold uppercase tracking-wider">
            Clinical Roadmap
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Understanding Your Physiotherapy Journey
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            A transparent, educational breakdown of how structured physical rehabilitation works—from initial evaluation to progressive recovery.
          </p>
        </div>

        {/* Step Navigation Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-3 ${
                  isActive
                    ? 'bg-teal-800 text-white border-teal-800 shadow-md scale-[1.02]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isActive ? 'bg-teal-700 text-teal-100' : 'bg-teal-50 text-teal-700'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-mono font-bold ${
                    isActive ? 'text-teal-200' : 'text-slate-400'
                  }`}>
                    {step.number}
                  </span>
                </div>
                <div>
                  <span className="block text-xs sm:text-sm font-bold leading-snug">
                    {step.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Interactive Panel for Selected Step */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 lg:p-10 shadow-sm transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider">
                {steps[activeStep].badge}
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {steps[activeStep].title}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {steps[activeStep].description}
              </p>

              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Key Focus in this Phase:
                </span>
                {steps[activeStep].details.map((detail, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700">{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block">
                  Clinical Insight
                </span>
                <p className="text-sm text-slate-800 font-medium italic leading-relaxed">
                  "{steps[activeStep].insight}"
                </p>
                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                  <span>Phase {activeStep + 1} of 4</span>
                  {activeStep < 3 && (
                    <button
                      onClick={() => setActiveStep(activeStep + 1)}
                      className="inline-flex items-center gap-1 font-bold text-teal-700 hover:text-teal-800"
                    >
                      <span>Next Phase</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Ethical disclaimer banner */}
        <div className="mt-6 flex items-center gap-2.5 text-xs text-slate-500 justify-center">
          <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Physical rehabilitation response varies by individual tissue condition, adherence, and general health.</span>
        </div>

      </div>
    </section>
  );
};
