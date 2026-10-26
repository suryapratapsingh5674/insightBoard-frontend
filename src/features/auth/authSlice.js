import { createSlice } from '@reduxjs/toolkit';
import { setAccessToken } from '../../services/api';

const initialState = {
  user: null,
  isAuthenticated: false,
  isInitialized: false, // True once initial session restore check finishes
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
      state.isInitialized = true;
      if (accessToken) {
        setAccessToken(accessToken);
      }
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
      setAccessToken(null);
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
});

export const { setCredentials, logoutUser, setInitialized } = authSlice.actions;

export default authSlice.reducer;
