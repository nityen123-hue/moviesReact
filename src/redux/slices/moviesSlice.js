import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import movieService from '../../services/movieService';

export const fetchPopularMovies = createAsyncThunk(
  'movies/fetchPopular',
  async (page = 1, { rejectWithValue }) => {
    try {
      const data = await movieService.getPopularMovies(page);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch popular movies');
    }
  }
);

export const fetchTrendingMovies = createAsyncThunk(
  'movies/fetchTrending',
  async ({ timeWindow = 'week', page = 1 } = {}, { rejectWithValue }) => {
    try {
      const data = await movieService.getTrendingMovies(timeWindow, page);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch trending movies');
    }
  }
);

export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchDetails',
  async (movieId, { rejectWithValue }) => {
    try {
      const data = await movieService.getMovieDetails(movieId);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch movie details');
    }
  }
);

export const fetchMovieCredits = createAsyncThunk(
  'movies/fetchCredits',
  async (movieId, { rejectWithValue }) => {
    try {
      const data = await movieService.getMovieCredits(movieId);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch movie credits');
    }
  }
);

export const searchMovies = createAsyncThunk(
  'movies/search',
  async ({ query, page = 1 }, { rejectWithValue }) => {
    try {
      if (!query || !query.trim()) {
        return { results: [], page: 1, total_pages: 1, total_results: 0, query: '' };
      }
      const data = await movieService.searchMovies(query.trim(), page);
      return { ...data, query: query.trim() };
    } catch (err) {
      return rejectWithValue(err.message || 'Search failed');
    }
  }
);

export const fetchGenres = createAsyncThunk(
  'movies/fetchGenres',
  async (_, { getState, rejectWithValue }) => {
    const { movies } = getState();
    if (movies.genres.items && movies.genres.items.length > 0) {
      return movies.genres.items;
    }
    try {
      const genres = await movieService.getGenres();
      return genres;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch genres');
    }
  }
);

export const fetchMoviesByGenre = createAsyncThunk(
  'movies/fetchByGenre',
  async ({ genreId, page = 1 }, { rejectWithValue }) => {
    try {
      const data = await movieService.getMoviesByGenre(genreId, page);
      return { ...data, genreId };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch genre movies');
    }
  }
);

const initialState = {
  popular: {
    items: [],
    page: 1,
    totalPages: 1,
    totalResults: 0,
    loading: false,
    error: null,
  },
  trending: {
    items: [],
    page: 1,
    totalPages: 1,
    totalResults: 0,
    loading: false,
    error: null,
  },
  selectedMovie: {
    data: null,
    credits: null,
    loading: false,
    error: null,
  },
  search: {
    query: '',
    results: [],
    page: 1,
    totalPages: 1,
    totalResults: 0,
    loading: false,
    error: null,
  },
  genres: {
    items: [],
    loading: false,
    error: null,
  },
  byGenre: {
    genreId: null,
    items: [],
    page: 1,
    totalPages: 1,
    totalResults: 0,
    loading: false,
    error: null,
  },
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.search.results = [];
      state.search.query = '';
      state.search.page = 1;
      state.search.totalPages = 1;
      state.search.totalResults = 0;
      state.search.error = null;
    },
    clearSelectedMovie: (state) => {
      state.selectedMovie.data = null;
      state.selectedMovie.credits = null;
      state.selectedMovie.loading = false;
      state.selectedMovie.error = null;
    },
    setSearchQuery: (state, action) => {
      state.search.query = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPopularMovies.pending, (state) => {
        state.popular.loading = true;
        state.popular.error = null;
      })
      .addCase(fetchPopularMovies.fulfilled, (state, action) => {
        state.popular.loading = false;
        state.popular.items = action.payload.results || [];
        state.popular.page = action.payload.page || 1;
        state.popular.totalPages = Math.min(action.payload.total_pages || 1, 500);
        state.popular.totalResults = action.payload.total_results || 0;
      })
      .addCase(fetchPopularMovies.rejected, (state, action) => {
        state.popular.loading = false;
        state.popular.error = action.payload;
      });

    builder
      .addCase(fetchTrendingMovies.pending, (state) => {
        state.trending.loading = true;
        state.trending.error = null;
      })
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        state.trending.loading = false;
        state.trending.items = action.payload.results || [];
        state.trending.page = action.payload.page || 1;
        state.trending.totalPages = Math.min(action.payload.total_pages || 1, 500);
        state.trending.totalResults = action.payload.total_results || 0;
      })
      .addCase(fetchTrendingMovies.rejected, (state, action) => {
        state.trending.loading = false;
        state.trending.error = action.payload;
      });

    builder
      .addCase(fetchMovieDetails.pending, (state) => {
        state.selectedMovie.loading = true;
        state.selectedMovie.error = null;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.selectedMovie.loading = false;
        state.selectedMovie.data = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.selectedMovie.loading = false;
        state.selectedMovie.error = action.payload;
      });

    builder
      .addCase(fetchMovieCredits.fulfilled, (state, action) => {
        state.selectedMovie.credits = action.payload;
      });

    builder
      .addCase(searchMovies.pending, (state) => {
        state.search.loading = true;
        state.search.error = null;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.search.loading = false;
        state.search.results = action.payload.results || [];
        state.search.page = action.payload.page || 1;
        state.search.totalPages = Math.min(action.payload.total_pages || 1, 500);
        state.search.totalResults = action.payload.total_results || 0;
        state.search.query = action.payload.query || '';
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.search.loading = false;
        state.search.error = action.payload;
      });

    builder
      .addCase(fetchGenres.pending, (state) => {
        state.genres.loading = true;
        state.genres.error = null;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.genres.loading = false;
        state.genres.items = action.payload || [];
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.genres.loading = false;
        state.genres.error = action.payload;
      });

    builder
      .addCase(fetchMoviesByGenre.pending, (state) => {
        state.byGenre.loading = true;
        state.byGenre.error = null;
      })
      .addCase(fetchMoviesByGenre.fulfilled, (state, action) => {
        state.byGenre.loading = false;
        state.byGenre.genreId = action.payload.genreId;
        state.byGenre.items = action.payload.results || [];
        state.byGenre.page = action.payload.page || 1;
        state.byGenre.totalPages = Math.min(action.payload.total_pages || 1, 500);
        state.byGenre.totalResults = action.payload.total_results || 0;
      })
      .addCase(fetchMoviesByGenre.rejected, (state, action) => {
        state.byGenre.loading = false;
        state.byGenre.error = action.payload;
      });
  },
});

export const { clearSearchResults, clearSelectedMovie, setSearchQuery } = moviesSlice.actions;
export default moviesSlice.reducer;
