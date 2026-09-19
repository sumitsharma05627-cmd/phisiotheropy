import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  path?: string; // alias for canonicalPath
  keywords?: string;
  type?: 'website' | 'article' | 'profile' | 'medical';
  image?: string;
  noindex?: boolean;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalPath,
  path,
  keywords = 'online physiotherapy consultation, tele-rehabilitation, Dr Naresh PT, virtual physical therapy, back pain assessment, posture rehabilitation, knee pain exercises, Kiva clinic',
  type = 'website',
  image = '/kiva-logo.svg',
  noindex = false,
  schema,
}) => {
  // Resolve formatted title ensuring clinic branding
  const fullTitle = title.includes('Kiva') 
    ? title 
    : `${title} | Kiva Physiotherapy Clinic`;

  // Determine origin safely
  const origin = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://kivaphysiotherapy.com';

  // Normalize canonical path
  const routePath = canonicalPath || path || '/';
  const cleanPath = routePath.startsWith('/') ? routePath : `/${routePath}`;
  const canonicalUrl = `${origin}${cleanPath === '/' ? '' : cleanPath}`;

  // Format full absolute image URL for OpenGraph and Twitter cards
  const fullImageUrl = image.startsWith('http://') || image.startsWith('https://')
    ? image
    : `${origin}${image.startsWith('/') ? image : `/${image}`}`;

  // Direct DOM synchronization for immediate inspector, document.title, and crawlers
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // 1. Synchronize document title
    document.title = fullTitle;

    // 2. Synchronize meta description
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', description);

    // 3. Synchronize canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 4. Synchronize robots
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute(
      'content',
      noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );
  }, [fullTitle, description, canonicalUrl, noindex]);

  return (
    <Helmet>
      {/* Primary HTML & Title */}
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Canonical URL Tag */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Search Engine Robots Indexing */}
      <meta
        name="robots"
        content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}
      />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type === 'medical' ? 'website' : type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Kiva Physiotherapy Clinic" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />

      {/* Twitter / X Social Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={fullTitle} />

      {/* Schema.org JSON-LD Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

// Aliased export for compatibility with existing imports
export const SeoMeta = SEO;
