import React from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout() {
  const navigation = useNavigation();
  const isLoadingRoute = navigation.state === 'loading';

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] relative">
      {/* Top Global Data Layer Loading Bar */}
      {isLoadingRoute && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-indigo-100 overflow-hidden">
          <div className="h-full bg-indigo-600 animate-pulse w-full" />
        </div>
      )}

      {/* Fixed/Responsive Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
