import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../utils/constants';
import { loadFromStorage, saveToStorage } from '../../utils/storage';

const storedFavorites = loadFromStorage(STORAGE_KEYS.FAVORITES, { ids: [], items: [] });

const initialState = {
  ids: storedFavorites?.ids || [],
  items: storedFavorites?.items || [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
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

        saveToStorage(STORAGE_KEYS.FAVORITES, {
          ids: state.ids,
          items: state.items,
        });
      }
    },

    removeFavorite: (state, action) => {
      const movieId = action.payload;
      state.ids = state.ids.filter((id) => id !== movieId);
      state.items = state.items.filter((item) => item.id !== movieId);

      saveToStorage(STORAGE_KEYS.FAVORITES, {
        ids: state.ids,
        items: state.items,
      });
    },

    toggleFavorite: (state, action) => {
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

      saveToStorage(STORAGE_KEYS.FAVORITES, {
        ids: state.ids,
        items: state.items,
      });
    },

    syncFavorites: (state) => {
      const stored = loadFromStorage(STORAGE_KEYS.FAVORITES, { ids: [], items: [] });
      state.ids = stored?.ids || [];
      state.items = stored?.items || [];
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite, syncFavorites } = favoritesSlice.actions;

export const selectIsFavorite = (state, movieId) => {
  return state.favorites.ids.includes(movieId);
};

export default favoritesSlice.reducer;
