import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../utils/constants';
import { loadFromStorage, saveToStorage } from '../../utils/storage';

const storedWatchlist = loadFromStorage(STORAGE_KEYS.WATCHLIST, { ids: [], items: [] });

const initialState = {
  ids: storedWatchlist?.ids || [],
  items: storedWatchlist?.items || [],
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addWatchlist: (state, action) => {
      const movie = action.payload;
      if (!movie || !movie.id) return;

      const exists = state.ids.includes(movie.id);
      if (!exists) {
        state.ids.push(movie.id);
        const summary = {
          id: movie.id,
          title: movie.title || movie.name || 'Untitled',
          poster_path: movie.poster_path || null,
          backdrop_path: movie.backdrop_path || null,
          vote_average: movie.vote_average || 0,
          release_date: movie.release_date || movie.first_air_date || '',
          overview: movie.overview || '',
          genres: movie.genres || [],
        };
        state.items.push(summary);

        saveToStorage(STORAGE_KEYS.WATCHLIST, {
          ids: state.ids,
          items: state.items,
        });
      }
    },

    removeWatchlist: (state, action) => {
      const movieId = action.payload;
      state.ids = state.ids.filter((id) => id !== movieId);
      state.items = state.items.filter((item) => item.id !== movieId);

      saveToStorage(STORAGE_KEYS.WATCHLIST, {
        ids: state.ids,
        items: state.items,
      });
    },

    toggleWatchlist: (state, action) => {
      const movie = action.payload;
      if (!movie || !movie.id) return;

      const index = state.ids.indexOf(movie.id);
      if (index >= 0) {
        state.ids.splice(index, 1);
        state.items = state.items.filter((item) => item.id !== movie.id);
      } else {
        state.ids.push(movie.id);
        const summary = {
          id: movie.id,
          title: movie.title || movie.name || 'Untitled',
          poster_path: movie.poster_path || null,
          backdrop_path: movie.backdrop_path || null,
          vote_average: movie.vote_average || 0,
          release_date: movie.release_date || movie.first_air_date || '',
          overview: movie.overview || '',
          genres: movie.genres || [],
        };
        state.items.push(summary);
      }

      saveToStorage(STORAGE_KEYS.WATCHLIST, {
        ids: state.ids,
        items: state.items,
      });
    },

    syncWatchlist: (state) => {
      const stored = loadFromStorage(STORAGE_KEYS.WATCHLIST, { ids: [], items: [] });
      state.ids = stored?.ids || [];
      state.items = stored?.items || [];
    },
  },
});

export const { addWatchlist, removeWatchlist, toggleWatchlist, syncWatchlist } = watchlistSlice.actions;

export const selectIsInWatchlist = (state, movieId) => {
  return state.watchlist.ids.includes(movieId);
};

export default watchlistSlice.reducer;
