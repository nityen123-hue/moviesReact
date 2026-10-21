import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../utils/constants';
import { loadFromStorage, saveToStorage, removeFromStorage } from '../../utils/storage';

const SEED_USERS = [
  {
    id: 'user_demo_1',
    name: 'Alex Rivera',
    email: 'demo@cinevault.com',
    passwordHash: btoa('Demo1234!'),
    createdAt: new Date().toISOString(),
  },
];

const getStoredUsers = () => {
  const users = loadFromStorage(STORAGE_KEYS.AUTH_REGISTERED_USERS, null);
  if (!users || !Array.isArray(users) || users.length === 0) {
    saveToStorage(STORAGE_KEYS.AUTH_REGISTERED_USERS, SEED_USERS);
    return SEED_USERS;
  }
  return users;
};

const initialUser = loadFromStorage(STORAGE_KEYS.AUTH_CURRENT_USER, null);

const initialState = {
  currentUser: initialUser,
  isAuthenticated: Boolean(initialUser),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { email, password } = action.payload;
      state.loading = true;
      state.error = null;

      const users = getStoredUsers();
      const user = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!user) {
        state.loading = false;
        state.error = 'No account found with this email address. Please register.';
        return;
      }

      const encodedInput = btoa(password);
      if (user.passwordHash !== encodedInput) {
        state.loading = false;
        state.error = 'Invalid password. Please check your credentials.';
        return;
      }

      const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      };

      state.currentUser = safeUser;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;

      saveToStorage(STORAGE_KEYS.AUTH_CURRENT_USER, safeUser);
    },

    register: (state, action) => {
      const { name, email, password } = action.payload;
      state.loading = true;
      state.error = null;

      const users = getStoredUsers();
      const existingUser = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (existingUser) {
        state.loading = false;
        state.error = 'An account with this email address already exists. Please log in.';
        return;
      }

      const newUser = {
        id: 'user_' + Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash: btoa(password),
        createdAt: new Date().toISOString(),
      };

      const updatedUsers = [...users, newUser];
      saveToStorage(STORAGE_KEYS.AUTH_REGISTERED_USERS, updatedUsers);

      const safeUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      };

      state.currentUser = safeUser;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;

      saveToStorage(STORAGE_KEYS.AUTH_CURRENT_USER, safeUser);
    },

    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      removeFromStorage(STORAGE_KEYS.AUTH_CURRENT_USER);
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const { login, register, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
