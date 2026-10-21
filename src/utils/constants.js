
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

export const IMAGE_SIZES = {
  POSTER_SM: 'w342',
  POSTER_MD: 'w500',
  POSTER_LG: 'w780',
  BACKDROP_SM: 'w780',
  BACKDROP_LG: 'w1280',
  BACKDROP_ORIGINAL: 'original',
  PROFILE_MD: 'w185',
};

export const getPosterUrl = (path, size = IMAGE_SIZES.POSTER_MD) => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
};

export const getBackdropUrl = (path, size = IMAGE_SIZES.BACKDROP_LG) => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
};

export const getProfileUrl = (path, size = IMAGE_SIZES.PROFILE_MD) => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
};

export const STORAGE_KEYS = {
  AUTH_CURRENT_USER: 'cinevault_auth_user',
  AUTH_REGISTERED_USERS: 'cinevault_registered_users',
  FAVORITES: 'cinevault_favorites',
  WATCHLIST: 'cinevault_watchlist',
};

export const APP_NAME = 'CineVault';
export const APP_TAGLINE = 'Your Gateway to Cinema';
