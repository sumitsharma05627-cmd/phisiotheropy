import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Filter, 
  X, 
  CalendarCheck, 
  ShieldCheck, 
  ChevronRight, 
  Info,
  Maximize2
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { Helmet } from 'react-helmet-async';
import { getCanonicalUrl, getOgImageUrl } from '../utils/seoHelper';
import { GalleryImage, GalleryCategory } from '../types';

interface GalleryPageProps {
  onNavigate: (page: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onNavigate }) => {
  const { settings, featuredGallery } = useClinic();
  const [images, setImages] = useState<GalleryImage[]>(featuredGallery || []);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [activeModalImage, setActiveModalImage] = useState<GalleryImage | null>(null);

  const categories: string[] = [
    'All',
    'Clinic',
    'Physiotherapy',
    'Equipment',
    'Patient Experience'
  ];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const url = selectedCategory === 'All' 
          ? '/api/gallery' 
          : `/api/gallery?category=${encodeURIComponent(selectedCategory)}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.images && data.images.length > 0) {
            setImages(data.images);
          } else if (featuredGallery && featuredGallery.length > 0) {
            setImages(
              selectedCategory === 'All' 
                ? featuredGallery 
                : featuredGallery.filter(img => img.category === selectedCategory)
            );
          }
        }
      } catch (err) {
        console.warn('Could not fetch gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [selectedCategory, featuredGallery]);

  const canonicalUrl = getCanonicalUrl('/gallery');
  const ogImageUrl = getOgImageUrl('/kiva-logo.svg');
  const pageTitle = "Clinic Facility & Care Gallery | Kiva Physiotherapy Clinic";
  const pageDescription = "View authentic clinic facility photos, physiotherapy equipment, rehabilitation exercises, and patient care moments at Kiva Physiotherapy Clinic.";

  return (
    <div className="bg-slate-50 min-h-screen">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="physiotherapy clinic photos, rehabilitation clinic gallery, physiotherapy equipment, treatment facility India, Kiva clinic" />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Kiva Physiotherapy Clinic" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:alt" content={pageTitle} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:image:alt" content={pageTitle} />

        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ImageGallery',
            name: 'Kiva Physiotherapy Clinic Rehabilitation Gallery',
            description: 'Authentic visual showcase of clinic rehabilitation exercises, facilities, and care equipment.',
            url: canonicalUrl,
          })}
        </script>
      </Helmet>

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-teal-900 via-teal-950 to-slate-900 text-white pt-14 pb-16 px-4 sm:px-6 lg:px-8 border-b border-teal-800/60">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-teal-800/80 border border-teal-700 text-teal-200 text-xs font-semibold uppercase tracking-wider shadow-xs">
            <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-teal-500/40">
              <img src="/kiva-logo.svg" alt="Kiva Logo" className="w-full h-full object-contain" />
            </div>
            <span>Kiva Clinic & Care Showcase</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Clinic & Rehabilitation Gallery
          </h1>

          <p className="text-base sm:text-lg text-teal-100/90 max-w-2xl mx-auto leading-relaxed">
            Explore our clinic atmosphere, therapeutic equipment, consultation setup, and rehabilitation environment.
          </p>
        </div>
      </section>

      {/* Main Gallery Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Privacy & Ethical Publishing Notice */}
        <div className="mb-8 p-4 rounded-xl bg-teal-50/80 border border-teal-200 text-teal-950 text-xs sm:text-sm flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold block mb-0.5 text-teal-900">Patient Privacy & Authentic Documentation</span>
            All patient photos, therapy progressions, and session snapshots are published strictly with express patient consent. Personal identifying documents and medical scans remain private and are never displayed publicly.
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              id={`gallery-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Images Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-500">
            <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm">Loading gallery photos...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <Camera className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No images in this category yet</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Our clinic administrator regularly updates our facility and session photos. Check back shortly or view all categories.
            </p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-teal-700 hover:underline pt-2"
            >
              View All Photos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img) => (
              <div
                key={img.id}
                id={`gallery-item-${img.id}`}
                onClick={() => setActiveModalImage(img)}
                className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between"
              >
                <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={img.image_url}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-white/90 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5" /> View Photo
                    </span>
                  </div>
                  <span className="absolute top-3 left-3 text-[11px] font-bold text-white bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-md">
                    {img.category}
                  </span>
                </div>

                <div className="p-4 space-y-1">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {img.title}
                  </h3>
                  {img.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {img.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {activeModalImage && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => setActiveModalImage(null)}
                className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black text-white p-2 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[60vh] bg-slate-950 flex items-center justify-center overflow-hidden">
                <img
                  src={activeModalImage.image_url}
                  alt={activeModalImage.title}
                  className="max-h-[60vh] w-auto max-w-full object-contain"
                />
              </div>

              <div className="p-6 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                    {activeModalImage.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {activeModalImage.title}
                </h3>
                {activeModalImage.description && (
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {activeModalImage.description}
                  </p>
                )}
                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    Kiva Physiotherapy Clinic Facility & Session Asset
                  </span>
                  <button
                    onClick={() => {
                      setActiveModalImage(null);
                      onNavigate('appointments');
                    }}
                    className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 px-4 rounded-lg shadow-sm"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>Book Appointment</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-teal-800 to-teal-900 rounded-2xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white">Experience Focused Physiotherapy Care</h3>
            <p className="text-xs sm:text-sm text-teal-100">
              Get an individualized functional evaluation, movement plan, and guidance.
            </p>
          </div>
          <button
            onClick={() => onNavigate('appointments')}
            className="shrink-0 bg-white hover:bg-teal-50 text-teal-900 font-bold text-sm px-6 py-3 rounded-xl shadow-sm transition-transform active:scale-95"
          >
            Book Consultation — ₹{settings.consultation_fee || '500'}
          </button>
        </div>

      </section>
    </div>
  );
};
