import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const statCards = [
  {
    label: 'Total Giveaways Hosted',
    value: '15',
  },
  {
    label: 'Total Stablecoins Distributed',
    value: '500 USDC',
  },
  {
    label: 'Number of Participants',
    value: '250',
  },
  {
    label: 'Average Claim Rate',
    value: '85%',
  },
];

const claimsData = [
  { month: 'Jan', value: 80 },
  { month: 'Feb', value: 30 },
  { month: 'Mar', value: 60 },
  { month: 'Apr', value: 45 },
  { month: 'May', value: 85 },
  { month: 'Jun', value: 35 },
  { month: 'Jul', value: 70 },
];

const GiveawayAnalytics: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f051c] text-white font-DMSans">
      {/* Header */}
      <header className="border-b border-purple-900/30 bg-[#160728]/90 backdrop-blur">
        <div className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-10 py-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-white" />
            </div>
            <span className="text-xl font-semibold">Rayn</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Home
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Send
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Receive
            </a>
            <a href="#" className="text-purple-300 font-medium">
              Giveaways
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-purple-900/40 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-purple-700/30">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-10 py-10 space-y-10 max-w-[1400px] mx-auto">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-semibold">Giveaway Analytics</h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Track the performance of your hosted giveaways.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-2xl border border-purple-900/40 bg-[#1a0c2d] px-4 py-2 text-sm text-gray-300 hover:border-purple-700/40">
              All Giveaways
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="inline-flex items-center gap-2 rounded-2xl border border-purple-900/40 bg-[#1a0c2d] px-4 py-2 text-sm text-gray-300 hover:border-purple-700/40">
              Last 30 Days
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-3xl bg-[#1a0c2d] border border-purple-900/40 px-6 py-6 space-y-3 shadow-[0_18px_60px_rgba(72,25,129,0.35)]"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-purple-300">{card.label}</p>
              <p className="text-3xl font-semibold">{card.value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-[32px] bg-[#1a0c2d] border border-purple-900/40 overflow-hidden shadow-[0_18px_60px_rgba(72,25,129,0.35)]">
          <div className="px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Claims Over Time</h2>
              <p className="text-sm text-gray-400">Last 30 Days</p>
            </div>
            <div className="text-right flex gap-2">
              <p className="text-3xl font-semibold">212</p>
              <p className="text-sm text-green-400">↑ 15%</p>
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="h-[24rem] rounded-[28px] bg-gradient-to-b from-[#20103a] via-[#1a0d31] to-[#140926] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={claimsData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#3b0764" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    stroke="#a855f7"
                    tick={{ fill: '#a855f7', fontSize: 12 }}
                  />
                  <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                  <Tooltip
                    cursor={{ stroke: '#a855f7', strokeWidth: 1, strokeDasharray: '4 4' }}
                    contentStyle={{
                      backgroundColor: '#1a0c2d',
                      borderRadius: '12px',
                      border: '1px solid rgba(129, 38, 215, 0.4)',
                      color: '#f9f5ff',
                      fontSize: '0.75rem',
                    }}
                    labelStyle={{ color: '#c084fc', fontWeight: 600 }}
                    formatter={(value: number) => [`${value}`, 'Claims']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#a855f7"
                    strokeWidth={3}
                    fill="url(#colorValue)"
                    dot={false}
                    activeDot={{ r: 6, fill: '#c084fc', strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default GiveawayAnalytics;

