import React from 'react';
import Sidebar from '../navigation/Sidebar';
import BottomNav from '../navigation/BottomNav';

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Main application layout with sidebar for desktop and bottom nav for mobile
 */
const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#191022] via-[#231036] to-[#191022]">
      {/* Desktop Sidebar Navigation */}
      <Sidebar />
      
      {/* Main Content Area - shifted right on desktop to accommodate sidebar */}
      <div className="lg:pl-64 min-h-screen">
        {children}
      </div>
      
      {/* Mobile Bottom Navigation - only shows on mobile */}
      <BottomNav />
    </div>
  );
};

export default AppLayout;
