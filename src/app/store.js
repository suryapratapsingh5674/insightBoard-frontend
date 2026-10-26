import { configureStore } from '@reduxjs/toolkit';
import uiReducer from '../features/ui/uiSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    // Note: Business data (customers, products, orders, analytics) is managed by TanStack Query.
  },
  devTools: process.env.NODE_ENV !== 'production',
});
