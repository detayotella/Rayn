import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Home, Send, ArrowDownToLine, Gift, Award, User, Settings, LogOut } from 'lucide-react';
import Logo from '../../assets/Logo.png';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/send', icon: Send, label: 'Send' },
    { path: '/receive', icon: ArrowDownToLine, label: 'Receive' },
    { path: '/giveaway', icon: Gift, label: 'Giveaways' },
    { path: '/rewards', icon: Award, label: 'Rewards' },
    { path: '/profile-summary', icon: User, label: 'Profile' },
  ];

  const bottomItems = [
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64 bg-[#1a0b2e]/95 backdrop-blur-lg border-r border-purple-900/30 z-40">
      {/* Logo Section */}
      <div className="p-6 border-b border-purple-900/30">
        <div className="flex items-center gap-3">
          <img src={Logo} alt="Rayn logo" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-bold text-white">Rayn</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                active
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-purple-900/30'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'fill-white/20' : ''}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-purple-900/30 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                active
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-purple-900/30'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
        
        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.clear();
            navigate('/');
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
