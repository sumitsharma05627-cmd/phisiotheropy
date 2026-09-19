import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Maximize2, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { GalleryImage } from '../../types';

interface GalleryPreviewProps {
  onNavigate: (page: string) => void;
}

export const GalleryPreview: React.FC<GalleryPreviewProps> = ({ onNavigate }) => {
  const { featuredGallery } = useClinic();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const images: GalleryImage[] = featuredGallery || [];

  // Filter based on selected category
  const filteredImages = selectedCategory === 'All'
    ? images
    : images.filter(img => img.category?.toLowerCase() === selectedCategory.toLowerCase());

  // Dynamically derive categories present in the data, plus standard types
  const candidateCategories = ['All', 'Clinic', 'Team', 'Equipment', 'Patient Experience', 'Events'];
  const presentCategories = candidateCategories.filter(cat => {
    if (cat === 'All') return true;
    return images.some(img => img.category?.toLowerCase() === cat.toLowerCase());
  });

  // Lightbox keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') setActiveLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) => 
          prev !== null ? (prev + 1) % filteredImages.length : null
        );
      }
      if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) => 
          prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : null
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, filteredImages.length]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold uppercase tracking-wider">
            Facility & Care Environment
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Clinic & Patient Experience Gallery
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Real photos of our clean treatment rooms, rehabilitation tools, and guided mobility sessions.
          </p>
        </div>

        <button
          onClick={() => onNavigate('gallery')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-800 hover:underline px-3.5 py-2 rounded-xl bg-white border border-slate-200 self-start sm:self-auto"
        >
          <span>View All Photos</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Category Filter Pills */}
      {presentCategories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {presentCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Gallery Layout: Large Featured + Surrounding Images OR Empty State */}
      {filteredImages.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 rounded-3xl border border-slate-200 max-w-xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center mx-auto">
            <Camera className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">
            Clinic photos will appear here once added by the clinic.
          </p>
          <p className="text-xs text-slate-500">
            Check back soon as we update photographs of our facility, exercise equipment, and care setup.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Main Large Featured Image (left 7 cols) */}
          {filteredImages[0] && (
            <div
              onClick={() => setActiveLightboxIndex(0)}
              className="md:col-span-7 group relative h-72 sm:h-96 md:h-[420px] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs cursor-pointer"
            >
              <img
                src={filteredImages[0].image_url}
                alt={filteredImages[0].title || 'Clinic photo'}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-6">
                <span className="inline-block self-start text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-teal-600 text-white mb-1.5">
                  {filteredImages[0].category || 'Clinic'}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {filteredImages[0].title}
                </h3>
                {filteredImages[0].caption && (
                  <p className="text-xs text-slate-200 line-clamp-1 mt-0.5">
                    {filteredImages[0].caption}
                  </p>
                )}
                <span className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </span>
              </div>
            </div>
          )}

          {/* Smaller Surrounding Grid (right 5 cols) */}
          <div className="md:col-span-5 grid grid-cols-2 gap-4">
            {filteredImages.slice(1, 5).map((img, idx) => {
              const actualIdx = idx + 1;
              return (
                <div
                  key={img.id}
                  onClick={() => setActiveLightboxIndex(actualIdx)}
                  className="group relative h-36 sm:h-44 md:h-[202px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs cursor-pointer"
                >
                  <img
                    src={img.image_url}
                    alt={img.title || 'Clinic photo'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent flex flex-col justify-end p-3.5">
                    <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider">
                      {img.category}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate">
                      {img.title}
                    </h4>
                  </div>
                  <span className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Lightbox Modal */}
      {activeLightboxIndex !== null && filteredImages[activeLightboxIndex] && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveLightboxIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setActiveLightboxIndex(null)}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors z-10"
            aria-label="Close photo preview"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          {filteredImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveLightboxIndex((prev) => 
                  prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : 0
                );
              }}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/25 flex items-center justify-center transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next Button */}
          {filteredImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveLightboxIndex((prev) => 
                  prev !== null ? (prev + 1) % filteredImages.length : 0
                );
              }}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/25 flex items-center justify-center transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Main Modal Image & Caption */}
          <div 
            className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredImages[activeLightboxIndex].image_url}
              alt={filteredImages[activeLightboxIndex].title}
              className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
            />
            <div className="mt-4 text-center text-white space-y-1 max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-widest text-teal-400">
                {filteredImages[activeLightboxIndex].category} • Photo {activeLightboxIndex + 1} of {filteredImages.length}
              </span>
              <h4 className="text-lg font-bold">
                {filteredImages[activeLightboxIndex].title}
              </h4>
              {filteredImages[activeLightboxIndex].caption && (
                <p className="text-xs sm:text-sm text-slate-300">
                  {filteredImages[activeLightboxIndex].caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
