import React from 'react';
import { Link, useNavigate } from 'react-router';
import {
  ArrowLeft,
  Bell,
  Globe2,
  ShieldCheck,
  Users,
  Clock,
} from 'lucide-react';
import heroIllustration from '../../assets/communitygiveaway.jpg';
import referralIllustration from '../../assets/referral.jpg';
import avatarImage from '../../assets/avatar1.jpg';
import Navigation from '../../components/modules/Home/Navigation';
import { useState } from 'react';
import Logo from '../../assets/Logo.png';

const activeGiveaways = [
  {
    id: 1,
    title: 'Weekly Community Pool',
    description: 'Join the community pool and share in weekly stablecoin rewards.',
    type: 'Public',
    typeVariant: 'public' as const,
    participants: '1,250 Participants',
    timeline: 'Ends in 3 days',
    amount: '$500.00',
    status: 'remaining',
  },
  {
    id: 2,
    title: 'Private Beta Testers',
    description: 'Exclusive pool for early adopters helping us shape the Rayn experience.',
    type: 'Private',
    typeVariant: 'private' as const,
    participants: '50 Participants',
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f051c] text-white font-DMSans">
      <header className="border-b border-purple-900/30 bg-[#160728]/80 backdrop-blur-xl">
        <div className="mx-10 flex h-16 sm:h-20  items-center justify-between px-4 sm:px-6 lg:px-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 transition hover:bg-purple-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <img src={Logo} alt="Rayn logo" className="h-10 w-10 object-contain" />
            <span className="text-xl sm:text-2xl font-semibold">Rayn</span>
          </div>

          {/* <Navigation 
                  mobileMenuOpen={mobileMenuOpen} 
                  setMobileMenuOpen={setMobileMenuOpen} 
                /> */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button className="rounded-full p-2 transition hover:bg-purple-900/40">
              <Bell className="h-5 w-5" />
            </button>
            <div className="h-9 w-9 overflow-hidden rounded-full border border-purple-500/40 bg-gradient-to-br from-purple-500 to-pink-500 sm:h-10 sm:w-10">
              <img
                src={avatarImage}
                alt="User avatar"
                className="h-full w-full object-cover"
              />
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
    </div>
  );
};

export default GiveawayPage;
