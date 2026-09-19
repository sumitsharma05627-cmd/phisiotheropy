/**
 * SEO URL and metadata helpers for React Helmet Async dynamic tag injection
 */

export const getBaseUrl = (): string => {
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin;
  }
  return 'https://kivaphysiotherapy.com';
};

export const getCanonicalUrl = (path: string = '/'): string => {
  const base = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath === '/' ? '' : cleanPath}`;
};

export const getOgImageUrl = (imagePath: string = '/kiva-logo.svg'): string => {
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const base = getBaseUrl();
  const clean = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${base}${clean}`;
};
