import React from 'react';
import { Settings, ChevronRight, Users, Shield, Globe, FileText, HelpCircle } from 'lucide-react';

interface AccountItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

interface LegalItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}

export default function Profile(): React.JSX.Element {
  const accountItems: AccountItem[] = [
    {
      icon: Users,
      title: 'Referrals',
      description: 'Invite friends and earn rewards'
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Manage your account security'
    },
    {
      icon: Globe,
      title: 'Language',
      description: 'Choose your preferred language'
    }
  ];

  const legalItems: LegalItem[] = [
    {
      icon: FileText,
      title: 'Terms & Conditions'
    },
    {
      icon: FileText,
      title: 'Privacy Policy'
    },
    {
      icon: HelpCircle,
      title: 'Contact Support'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#191022] via-[#231036] to-[#191022] text-white font-DMSans">
      {/* Header */}
      <header className="border-b border-purple-900/30 bg-[#1a0b2e]/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center transform rotate-45">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded transform -rotate-45"></div>
              </div>
              <span className="text-xl sm:text-2xl font-bold">Rayn</span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button className="p-2 hover:bg-purple-900/30 rounded-full transition-colors">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Profile Section */}
        <div className="text-center mb-10 sm:mb-16">
          {/* Profile Image */}
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 p-1">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" 
                  alt="Sophia Adebayo" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Sophia Adebayo</h1>
          <p className="text-gray-400 text-base sm:text-lg mb-1">@sophia_adebayo</p>
          <p className="text-gray-500 text-sm sm:text-base">Joined in 2025</p>
        </div>

        {/* Account Section */}
        <div className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">Account</h2>
          <div className="space-y-3">
            {accountItems.map((item, index) => (
              <button
                key={index}
                className="w-full bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-purple-700/30 hover:border-purple-600/50 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-purple-600/40 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-purple-400" />
                    </div>

                    {/* Text */}
                    <div className="text-left">
                      <p className="font-semibold text-base sm:text-lg mb-1">{item.title}</p>
                      <p className="text-gray-400 text-sm sm:text-base">{item.description}</p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Legal Section */}
        <div className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">Legal</h2>
          <div className="space-y-3">
            {legalItems.map((item, index) => (
              <button
                key={index}
                className="w-full bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-purple-700/30 hover:border-purple-600/50 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-purple-600/40 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-purple-400" />
                    </div>

                    {/* Text */}
                    <p className="font-semibold text-base sm:text-lg">{item.title}</p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="flex justify-center">
          <button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold py-4 px-12 sm:px-16 rounded-xl sm:rounded-2xl text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30">
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}