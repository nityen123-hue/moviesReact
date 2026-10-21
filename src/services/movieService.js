import apiClient, { isApiKeyConfigured } from './api';
import { FALLBACK_MOVIES, FALLBACK_GENRES } from './tmdbFallbackData';

const PAGE_SIZE = 12;

const paginateArray = (items, page = 1, pageSize = PAGE_SIZE) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const results = items.slice(startIndex, endIndex);
  const total_pages = Math.ceil(items.length / pageSize) || 1;
  return {
    page,
    results,
    total_pages,
    total_results: items.length,
  };
};

const movieService = {
  getPopularMovies: async (page = 1) => {
    if (isApiKeyConfigured()) {
      try {
        const response = await apiClient.get('/movie/popular', {
          params: { page, language: 'en-US' },
        });
        return response.data;
      } catch (err) {
        console.warn('Live TMDB API call failed, using authentic TMDB fallback dataset:', err.message);
      }
    }

    return paginateArray(FALLBACK_MOVIES, page);
  },

  getTrendingMovies: async (timeWindow = 'week', page = 1) => {
    if (isApiKeyConfigured()) {
      try {
        const response = await apiClient.get(`/trending/movie/${timeWindow}`, {
          params: { page, language: 'en-US' },
        });
        return response.data;
      } catch (err) {
        console.warn('Live TMDB API call failed, using authentic TMDB fallback dataset:', err.message);
      }
    }

    const trendingList = [...FALLBACK_MOVIES].reverse();
    return paginateArray(trendingList, page);
  },

  getMovieDetails: async (movieId) => {
    const id = Number(movieId);

    if (isApiKeyConfigured()) {
      try {
        const response = await apiClient.get(`/movie/${id}`, {
          params: {
            language: 'en-US',
            append_to_response: 'videos,release_dates,similar',
          },
        });
        return response.data;
      } catch (err) {
        console.warn('Live TMDB API call failed, using authentic TMDB fallback dataset:', err.message);
      }
    }

    const movie = FALLBACK_MOVIES.find((m) => m.id === id) || FALLBACK_MOVIES[0];
    const similarMovies = FALLBACK_MOVIES.filter((m) => m.id !== movie.id).slice(0, 6);

    return {
      ...movie,
      videos: {
        results: movie.trailerKey
          ? [{ key: movie.trailerKey, site: 'YouTube', type: 'Trailer', name: `${movie.title} Official Trailer` }]
          : [],
      },
      similar: {
        results: similarMovies,
      },
    };
  },

  getMovieCredits: async (movieId) => {
    const id = Number(movieId);

    if (isApiKeyConfigured()) {
      try {
        const response = await apiClient.get(`/movie/${id}/credits`, {
          params: { language: 'en-US' },
        });
        return response.data;
      } catch (err) {
        console.warn('Live TMDB API call failed, using authentic TMDB fallback dataset:', err.message);
      }
    }

    const movie = FALLBACK_MOVIES.find((m) => m.id === id) || FALLBACK_MOVIES[0];
    return {
      id: movie.id,
      cast: movie.cast || [],
      crew: movie.director ? [{ id: 999, job: 'Director', name: movie.director }] : [],
    };
  },

  searchMovies: async (query, page = 1) => {
    if (!query || !query.trim()) {
      return { page: 1, results: [], total_pages: 1, total_results: 0 };
    }

    const cleanQuery = query.trim().toLowerCase();

    if (isApiKeyConfigured()) {
      try {
        const response = await apiClient.get('/search/movie', {
          params: {
            query: cleanQuery,
            page,
            include_adult: false,
            language: 'en-US',
          },
        });
        return response.data;
      } catch (err) {
        console.warn('Live TMDB API call failed, using authentic TMDB fallback dataset:', err.message);
      }
    }

    const matched = FALLBACK_MOVIES.filter(
      (m) =>
        m.title.toLowerCase().includes(cleanQuery) ||
        (m.overview && m.overview.toLowerCase().includes(cleanQuery)) ||
        (m.director && m.director.toLowerCase().includes(cleanQuery)) ||
        (m.cast && m.cast.some((c) => c.name.toLowerCase().includes(cleanQuery)))
    );

    return paginateArray(matched, page);
  },

  getGenres: async () => {
    if (isApiKeyConfigured()) {
      try {
        const response = await apiClient.get('/genre/movie/list', {
          params: { language: 'en-US' },
        });
        return response.data.genres || FALLBACK_GENRES;
      } catch (err) {
        console.warn('Live TMDB API call failed, using authentic TMDB fallback dataset:', err.message);
      }
    }

    return FALLBACK_GENRES;
  },

  getMoviesByGenre: async (genreId, page = 1) => {
    const id = Number(genreId);

    if (isApiKeyConfigured()) {
      try {
        const response = await apiClient.get('/discover/movie', {
          params: {
            with_genres: id,
            page,
            sort_by: 'popularity.desc',
            include_adult: false,
            language: 'en-US',
          },
        });
        return response.data;
      } catch (err) {
        console.warn('Live TMDB API call failed, using authentic TMDB fallback dataset:', err.message);
      }
    }

    const filtered = FALLBACK_MOVIES.filter((m) => m.genre_ids && m.genre_ids.includes(id));
    return paginateArray(filtered.length > 0 ? filtered : FALLBACK_MOVIES, page);
  },
};

export default movieService;
