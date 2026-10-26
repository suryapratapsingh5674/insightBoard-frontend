import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSidebarOpen: true, // For responsive mobile toggle
  dateRange: '30d',    // Global UI date range filter ('7d', '30d', '90d', '1y')
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setDateRange } = uiSlice.actions;

export default uiSlice.reducer;
