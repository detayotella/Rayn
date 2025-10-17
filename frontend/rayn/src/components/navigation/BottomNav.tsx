import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Home, Send, Gift, Award, User } from 'lucide-react';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/send', icon: Send, label: 'Send' },
    { path: '/giveaway', icon: Gift, label: 'Giveaway' },
    { path: '/rewards', icon: Award, label: 'Rewards' },
    { path: '/profile-summary', icon: User, label: 'Profile' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1a0b2e]/95 backdrop-blur-lg border-t border-purple-900/30 z-50 md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                active
                  ? 'text-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon 
                className={`w-5 h-5 ${active ? 'fill-purple-400' : ''}`} 
                strokeWidth={active ? 2.5 : 2}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
