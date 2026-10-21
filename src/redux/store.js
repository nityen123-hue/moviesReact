import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './slices/moviesSlice';
import authReducer from './slices/authSlice';
import favoritesReducer from './slices/favoritesSlice';
import watchlistReducer from './slices/watchlistSlice';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    auth: authReducer,
    favorites: favoritesReducer,
    watchlist: watchlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
