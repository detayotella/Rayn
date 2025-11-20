import React from 'react';
import Sidebar from '../modules/navigation/Sidebar';
import BottomNav from '../modules/navigation/BottomNav';

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Main application layout with sidebar for desktop and bottom nav for mobile
 */
const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#251435] to-[#2e1a47] text-white flex flex-col lg:flex-row">
      {/* Desktop Sidebar Navigation */}
      <Sidebar />
      
      {/* Main Content Area - shifted right on desktop to accommodate sidebar */}
      <div className="flex-1 w-full lg:pl-64 min-h-screen pb-24 lg:pb-0">
        {children}
      </div>
      
      {/* Mobile Bottom Navigation - only shows on mobile */}
      <BottomNav />
    </div>
  );
};

export default AppLayout;
