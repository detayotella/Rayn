import React, { useState } from 'react';
import { Link } from 'react-router';
import { Bell, Heart, MessageCircle, Share2 } from 'lucide-react';
import Logo from '../assets/Logo.png';

interface Activity {
  id: number;
  type: 'giveaway_join' | 'transfer' | 'giveaway_new' | 'giveaway_won';
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  recipient?: {
    name: string;
    username: string;
  };
  amount?: string;
  giveaway?: {
    title: string;
    prize: string;
  };
  emoji: string;
  time: string;
  likes: number;
  isFriend: boolean;
}

export default function SocialFeed(): React.JSX.Element {
  const [filter, setFilter] = useState<'all' | 'friends' | 'giveaways'>('all');
  const [profileImage] = useState<string | null>(
    sessionStorage.getItem('raynProfileImage')
  );

  const activities: Activity[] = [
    {
      id: 1,
      type: 'giveaway_join',
      user: {
        name: 'Sarah Johnson',
        username: '@sarah_j',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
      },
      giveaway: {
        title: 'Weekly Community Giveaway',
        prize: '$500'
      },
      emoji: '🎁',
      time: '2m ago',
      likes: 12,
      isFriend: true
    },
    {
      id: 2,
      type: 'transfer',
      user: {
        name: 'Michael Chen',
        username: '@mikey',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
      },
      recipient: {
        name: 'Emma Wilson',
        username: '@emma_w'
      },
      amount: '$20',
      emoji: '🍕',
      time: '15m ago',
      likes: 8,
      isFriend: true
    },
    {
      id: 3,
      type: 'giveaway_new',
      user: {
        name: 'David Martinez',
        username: '@davidm',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
      },
      giveaway: {
        title: 'Birthday Celebration',
        prize: '$100'
      },
      emoji: '💰',
      time: '1h ago',
      likes: 34,
      isFriend: false
    },
    {
      id: 4,
      type: 'giveaway_won',
      user: {
        name: 'John Smith',
        username: '@johnsmith',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
      },
      giveaway: {
        title: 'Early Bird Special',
        prize: '$50'
      },
      emoji: '🎉',
      time: '3h ago',
      likes: 56,
      isFriend: true
    },
    {
      id: 5,
      type: 'transfer',
      user: {
        name: 'Lisa Anderson',
        username: '@lisa_a',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
      },
      recipient: {
        name: 'James Brown',
        username: '@jamesbrown'
      },
      amount: '$15',
      emoji: '☕',
      time: '5h ago',
      likes: 5,
      isFriend: false
    }
  ];

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'giveaway_join':
        return (
          <span>
            joined <span className="font-semibold text-purple-300">{activity.giveaway?.title}</span>
          </span>
        );
      case 'transfer':
        return (
          <span>
            sent <span className="font-semibold text-purple-300">{activity.recipient?.name}</span>{' '}
            <span className="font-bold text-green-400">{activity.amount}</span> for {activity.emoji}
          </span>
        );
      case 'giveaway_new':
        return (
          <span>
            created a new giveaway: <span className="font-semibold text-purple-300">{activity.giveaway?.title}</span> - Win{' '}
            <span className="font-bold text-yellow-400">{activity.giveaway?.prize}</span>
          </span>
        );
      case 'giveaway_won':
        return (
          <span>
            won <span className="font-bold text-yellow-400">{activity.giveaway?.prize}</span> in{' '}
            <span className="font-semibold text-purple-300">{activity.giveaway?.title}</span>
          </span>
        );
    }
  };

  const filteredActivities = activities.filter((activity) => {
    if (filter === 'friends') return activity.isFriend;
    if (filter === 'giveaways') return activity.type.includes('giveaway');
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#251435] via-[#2e1a47] to-[#251435] text-white">
      {/* Header */}
      <header className="border-b border-purple-900/30 bg-[#261540]/80 backdrop-blur-sm">
        <div className="mx-2 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3">
              <img src={Logo} alt="Rayn logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
              <span className="text-xl sm:text-2xl font-bold">Rayn</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">Home</Link>
              <a href="#" className="text-white hover:text-purple-400 transition-colors">Feed</a>
              <Link to="/giveaways" className="text-gray-400 hover:text-white transition-colors">Giveaways</Link>
            </nav>

            <div className="flex items-center gap-3 sm:gap-4">
              <button className="p-2 hover:bg-purple-900/30 rounded-full transition-colors">
                <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Community Feed</h1>
          <p className="text-gray-400">See what your friends are up to</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
              filter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-900/30 text-gray-300 hover:bg-purple-900/50'
            }`}
          >
            All Activity
          </button>
          <button
            onClick={() => setFilter('friends')}
            className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
              filter === 'friends'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-900/30 text-gray-300 hover:bg-purple-900/50'
            }`}
          >
            Friends
          </button>
          <button
            onClick={() => setFilter('giveaways')}
            className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
              filter === 'giveaways'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-900/30 text-gray-300 hover:bg-purple-900/50'
            }`}
          >
            Giveaways
          </button>
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 backdrop-blur-sm rounded-2xl p-5 border border-purple-700/30 hover:border-purple-600/50 transition-all"
            >
              {/* User Info */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 overflow-hidden flex-shrink-0">
                  <img src={activity.user.avatar} alt={activity.user.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold">{activity.user.name}</span>
                    <span className="text-gray-400 text-sm">{activity.user.username}</span>
                    {activity.isFriend && (
                      <span className="text-xs bg-purple-600/30 text-purple-300 px-2 py-0.5 rounded-full">
                        Friend
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm mt-1">{getActivityText(activity)}</p>
                  <span className="text-gray-500 text-xs">{activity.time}</span>
                </div>
                <span className="text-2xl">{activity.emoji}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-6 text-sm text-gray-400 pl-15">
                <button className="flex items-center gap-2 hover:text-purple-400 transition-colors">
                  <Heart className="w-4 h-4" />
                  <span>{activity.likes}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-purple-400 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>Comment</span>
                </button>
                <button className="flex items-center gap-2 hover:text-purple-400 transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="bg-purple-900/40 hover:bg-purple-800/50 text-white font-medium py-3 px-8 rounded-xl border border-purple-700/30 transition-all">
            Load More
          </button>
        </div>
      </main>
    </div>
  );
}
