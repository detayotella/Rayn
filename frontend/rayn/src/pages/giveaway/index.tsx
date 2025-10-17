import React from 'react';
import { Link, useNavigate } from 'react-router';
import {
  ArrowLeft,
  Bell,
  Globe2,
  ShieldCheck,
  Users,
  Clock,
  Search,
  Plus,
  TrendingUp,
  Zap,
  DollarSign,
} from 'lucide-react';
import heroIllustration from '../../assets/communitygiveaway.jpg';
import referralIllustration from '../../assets/referral.jpg';
import avatarImage from '../../assets/avatar1.jpg';
import Logo from '../../assets/Logo.png';
import AppLayout from '../../components/layout/AppLayout';

const featuredGiveaway = {
  id: 0,
  title: 'Mega Community Giveaway',
  description: 'Join our biggest giveaway yet and win big!',
  type: 'Public',
  typeVariant: 'public' as const,
  participants: '2,547 Participants',
  participantCount: 2547,
  timeline: 'Ends in 12h 45m',
  amount: '$1,000.00',
  status: 'featured',
  friendsIn: ['Sarah', 'John', 'Michael', 'Emma'],
};

const endingSoon = [
  {
    id: 1,
    title: 'Flash Friday Bonus',
    participants: 234,
    timeline: 'Ends in 2h 15m',
    amount: '$50.00',
    typeVariant: 'public' as const,
  },
  {
    id: 2,
    title: 'Weekend Special',
    participants: 445,
    timeline: 'Ends in 5h 30m',
    amount: '$75.00',
    typeVariant: 'public' as const,
  },
];

const easyToWin = [
  {
    id: 3,
    title: 'Newcomer Welcome',
    participants: 12,
    timeline: 'Ends in 2 days',
    amount: '$25.00',
    typeVariant: 'private' as const,
  },
  {
    id: 4,
    title: 'Early Bird Bonus',
    participants: 34,
    timeline: 'Ends in 1 day',
    amount: '$30.00',
    typeVariant: 'public' as const,
  },
];

const bigPrizes = [
  {
    id: 5,
    title: 'Monthly Mega Draw',
    participants: 3421,
    timeline: 'Ends in 15 days',
    amount: '$2,500.00',
    typeVariant: 'public' as const,
  },
  {
    id: 6,
    title: 'Platinum Pool',
    participants: 1876,
    timeline: 'Ends in 7 days',
    amount: '$1,500.00',
    typeVariant: 'private' as const,
  },
];

const activeGiveaways = [
  {
    id: 7,
    title: 'Weekly Community Pool',
    description: 'Join the community pool and share in weekly stablecoin rewards.',
    type: 'Public',
    typeVariant: 'public' as const,
    participants: '1,250 Participants',
    participantCount: 1250,
    timeline: 'Ends in 3 days',
    amount: '$500.00',
    status: 'remaining',
  },
  {
    id: 8,
    title: 'Private Beta Testers',
    description: 'Exclusive pool for early adopters helping us shape the Rayn experience.',
    type: 'Private',
    typeVariant: 'private' as const,
    participants: '50 Participants',
    participantCount: 50,
    timeline: 'Ends in 10 days',
    amount: '$150.00',
    status: 'remaining',
  },
];

const discoverGiveaways = [
  {
    id: 1,
    title: 'Refer a Friend and Earn',
    description:
      'Invite your friends to join Rayn and earn stablecoins for each successful referral.',
    cta: 'Invite Friends',
    image: referralIllustration,
    imageAlt: 'Refer a friend illustration',
  },
  {
    id: 2,
    title: 'Daily Check-in Rewards',
    description:
      'Check in daily to earn small stablecoin rewards. Consistency pays off!',
    cta: 'Check In',
  },
];

const typeStyles = {
  public: 'bg-purple-900/30 border border-purple-500/30 text-purple-200',
  private: 'bg-pink-900/30 border border-pink-500/30 text-pink-200',
};

const typeIcons = {
  public: Globe2,
  private: ShieldCheck,
};


const GiveawayPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      {/* Page Header */}
      <header className="border-b border-purple-900/30 bg-[#1a0b2e]/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Page Title */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="lg:hidden flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 transition hover:bg-purple-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={() => navigate('/')}
                className="lg:hidden flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <img src={Logo} alt="Rayn logo" className="w-8 h-8 object-contain" />
                <span className="text-xl font-bold">Rayn</span>
              </button>
              <h1 className="hidden lg:block text-2xl font-bold text-white">Community Giveaways</h1>
            </div>
            
            {/* User Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/notifications')}
                className="p-2 hover:bg-purple-900/30 rounded-full transition-colors"
              >
                <Bell className="h-5 w-5" />
              </button>
              <button 
                onClick={() => navigate('/profile-summary')}
                className="h-9 w-9 overflow-hidden rounded-full border border-purple-500/40 bg-gradient-to-br from-purple-500 to-pink-500"
              >
                <img
                  src={avatarImage}
                  alt="User avatar"
                  className="h-full w-full object-cover"
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-0 py-10 sm:py-16">
        <section className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight">
            Community Giveaways
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base sm:text-lg text-gray-400">
            Participate in our community giveaways and earn stablecoins.
          </p>
        </section>

        <section className="mt-12">
          <div className="overflow-hidden rounded-3xl border border-purple-900/40 bg-gradient-to-br from-[#241036] via-[#1a0e2d] to-[#140a27] shadow-[0_20px_70px_rgba(98,45,177,0.35)]">
            <div className="bg-gradient-to-r from-[#f2d7ff] via-[#e8c7ff] to-[#d0b4ff]">
              <img
                src={heroIllustration}
                alt="Community celebration illustration"
                className="h-64 w-full object-cover sm:h-[22rem]"
              />
            </div>
            <div className="px-6 py-8 sm:px-10 sm:py-10">
              <h2 className="text-2xl sm:text-3xl font-semibold">
                Welcome to the Rayn Community Giveaway!
              </h2>
              <p className="mt-3 text-gray-400">
                Join our community and participate in our first giveaway. Share the love and earn
                stablecoins.
              </p>
              <div className="mt-6">
                <button className="rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-3 text-base font-semibold transition hover:scale-[1.02] hover:from-purple-700 hover:to-purple-600">
                  Join Now
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Create Section */}
        <section className="mt-12">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search giveaways..."
                className="w-full bg-purple-900/20 border border-purple-700/30 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-600/50 transition-colors"
              />
            </div>
            <Link to="/giveaway/create">
              <button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 px-8 py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30">
                <Plus className="w-5 h-5" />
                Create Giveaway
              </button>
            </Link>
          </div>
        </section>

        {/* Featured Giveaway */}
        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            Featured Giveaway
          </h2>
          <div className="rounded-3xl border border-purple-500/40 bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-8 shadow-[0_20px_70px_rgba(168,85,247,0.4)] hover:shadow-[0_25px_80px_rgba(168,85,247,0.5)] transition-all cursor-pointer group">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-3 group-hover:text-purple-300 transition-colors">
                  {featuredGiveaway.title}
                </h3>
                <p className="text-gray-300 mb-4">{featuredGiveaway.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-purple-300">
                    <Users className="w-5 h-5" />
                    <span className="font-semibold">{featuredGiveaway.participantCount.toLocaleString()} joined</span>
                  </div>
                  <div className="flex items-center gap-2 text-pink-300">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">{featuredGiveaway.timeline}</span>
                  </div>
                  {featuredGiveaway.friendsIn.length > 0 && (
                    <div className="flex items-center gap-2 text-yellow-300">
                      <span className="text-sm">Friends in: {featuredGiveaway.friendsIn.slice(0, 3).join(', ')}
                        {featuredGiveaway.friendsIn.length > 3 && ` +${featuredGiveaway.friendsIn.length - 3} more`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-start lg:items-end gap-3">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                  {featuredGiveaway.amount}
                </div>
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-3 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg">
                  Join Now
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Ending Soon */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Zap className="w-7 h-7 text-yellow-400" />
            ⏰ Ending Soon
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {endingSoon.map((giveaway) => (
              <div
                key={giveaway.id}
                className="rounded-2xl border border-orange-500/40 bg-gradient-to-br from-orange-900/30 to-red-900/20 p-6 hover:border-orange-400/60 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{giveaway.title}</h3>
                    <p className="text-3xl font-bold text-orange-400">{giveaway.amount}</p>
                  </div>
                  <Clock className="w-6 h-6 text-orange-300 animate-pulse" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Users className="w-4 h-4" />
                    <span>{giveaway.participants} joined</span>
                  </div>
                  <span className="text-orange-300 font-semibold">{giveaway.timeline}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Easy to Win */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-7 h-7 text-green-400" />
            🎯 Easy to Win (Few Participants)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {easyToWin.map((giveaway) => (
              <div
                key={giveaway.id}
                className="rounded-2xl border border-green-500/40 bg-gradient-to-br from-green-900/30 to-emerald-900/20 p-6 hover:border-green-400/60 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{giveaway.title}</h3>
                    <p className="text-3xl font-bold text-green-400">{giveaway.amount}</p>
                  </div>
                  <span className="bg-green-500/20 text-green-300 text-xs px-3 py-1 rounded-full font-semibold">
                    High Chance!
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-green-300 font-semibold">
                    <Users className="w-4 h-4" />
                    <span>Only {giveaway.participants} joined</span>
                  </div>
                  <span className="text-gray-400">{giveaway.timeline}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Big Prizes */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-yellow-400" />
            💎 Big Prizes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {bigPrizes.map((giveaway) => (
              <div
                key={giveaway.id}
                className="rounded-2xl border border-yellow-500/40 bg-gradient-to-br from-yellow-900/30 to-amber-900/20 p-6 hover:border-yellow-400/60 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{giveaway.title}</h3>
                    <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                      {giveaway.amount}
                    </p>
                  </div>
                  <span className="text-3xl">💰</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Users className="w-4 h-4" />
                    <span>{giveaway.participants.toLocaleString()} joined</span>
                  </div>
                  <span className="text-gray-400">{giveaway.timeline}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-semibold">Your Active Giveaways</h2>
              <p className="mt-2 text-sm text-gray-400">
                Track and manage the giveaways you&apos;re currently hosting or participating in.
              </p>
            </div>
            <Link
              to="/rewards"
              className="text-sm font-semibold text-purple-300 transition hover:text-purple-200"
            >
              View reward history
            </Link>
          </div>

          <div className="mt-8 space-y-6">
            {activeGiveaways.map((giveaway) => {
              const VariantIcon = typeIcons[giveaway.typeVariant];

              return (
                <div
                  key={giveaway.id}
                  className="rounded-3xl border border-purple-900/40 bg-gradient-to-br from-[#211036]/90 via-[#1a0d2f]/90 to-[#130924]/90 p-6 sm:p-8 shadow-[0_18px_60px_rgba(72,25,129,0.35)]"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span
                          className={`flex items-center gap-2 rounded-full px-3 py-1 font-medium ${typeStyles[giveaway.typeVariant]}`}
                        >
                          <VariantIcon className="h-4 w-4" />
                          {giveaway.type}
                        </span>
                        <span className="flex items-center gap-2 text-gray-400">
                          <Users className="h-4 w-4" />
                          {giveaway.participants}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold">{giveaway.title}</h3>
                        <p className="mt-2 text-sm text-gray-400">{giveaway.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-4 text-left lg:items-end lg:text-right">
                      <span className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="h-4 w-4" />
                        {giveaway.timeline}
                      </span>
                      <div>
                        <p className="text-2xl font-semibold text-purple-200">{giveaway.amount}</p>
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                          {giveaway.status}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold transition hover:bg-purple-500">
                          View Details
                        </button>
                        <button className="rounded-xl border border-red-500/30 bg-red-900/30 px-4 py-2 text-sm font-semibold text-red-200 transition hover:border-red-400/60 hover:bg-red-900/40">
                          Close Giveaway
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-semibold">Active Giveaways</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {discoverGiveaways.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-3xl border border-purple-900/40 bg-gradient-to-br from-[#231036]/95 via-[#1a0d2f]/95 to-[#130924]/95 shadow-[0_18px_60px_rgba(72,25,129,0.35)]"
              >
                <div className="bg-gradient-to-r from-[#f2d7ff] via-[#e4cffd] to-[#d7c4ff] p-8">
                  {item.image ? (
                    <div className="flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.imageAlt}
                        className="h-36 w-auto rounded-2xl object-cover shadow-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <div className="rounded-2xl bg-white/90 p-5 shadow-lg">
                        <div className="grid grid-cols-7 gap-2">
                          {Array.from({ length: 28 }).map((_, index) => (
                            <span
                              key={index}
                              className={`h-3 w-3 rounded-full ${index % 7 === 0 ? 'bg-purple-400' : 'bg-purple-200'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="px-6 py-8 sm:px-8">
                  <h3 className="text-2xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-400">{item.description}</p>
                  <div className="mt-6">
                    <button className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold transition hover:bg-purple-500">
                      {item.cta}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </AppLayout>
  );
};

export default GiveawayPage;
