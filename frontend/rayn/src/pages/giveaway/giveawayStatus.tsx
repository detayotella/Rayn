import React, { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  Copy,
  Link as LinkIcon,
  Lock,
  PauseCircle,
  Power,
  Megaphone,
} from 'lucide-react';
import { useNavigate } from 'react-router';

type ParticipantStatus = 'claimed' | 'not_claimed';

interface Participant {
  username: string;
  claimed: string;
  status: ParticipantStatus;
}

const participants: Participant[] = [
  { username: '@emma_k', claimed: '$50.00', status: 'claimed' },
  { username: '@samuel_m', claimed: '$50.00', status: 'claimed' },
  { username: '@nneka_o', claimed: '$50.00', status: 'claimed' },
  { username: '@chidi_e', claimed: '$50.00', status: 'claimed' },
  { username: '@ada_u', claimed: '$50.00', status: 'claimed' },
  { username: '@femi_a', claimed: '$0.00', status: 'not_claimed' },
  { username: '@zara_b', claimed: '$0.00', status: 'not_claimed' },
];

const shareLink = 'https://rayn.app/giveaway/xyz123';
const giveawayPin = '123456';

const GiveawayStatus: React.FC = () => {
  const [copiedField, setCopiedField] = useState<'link' | 'pin' | null>(null);
  const navigate = useNavigate();

  const handleCopy = async (value: string, field: 'link' | 'pin') => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const statusLabel = (status: ParticipantStatus) =>
    status === 'claimed' ? 'Claimed' : 'Not Claimed';

  const statusColor = (status: ParticipantStatus) =>
    status === 'claimed' ? 'text-green-400' : 'text-yellow-400';

  return (
    <div className="min-h-screen bg-[#0e0419] text-white font-DMSans">
      {/* Header */}
      <header className="border-b border-purple-900/30 bg-[#130625]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-purple-600/70 hover:bg-purple-600 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-2xl font-semibold">Rayn</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full bg-purple-900/40 hover:bg-purple-900/60 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-purple-700/40">
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <section className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-semibold">Giveaway Details</h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Manage your hosted giveaway and track its progress.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-200">Giveaway Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#1d0f31] border border-purple-900/40 rounded-2xl px-6 py-5 space-y-2">
              <p className="text-sm text-gray-400">Status</p>
              <p className="text-xl font-semibold text-green-400">Active</p>
            </div>
            <div className="bg-[#1d0f31] border border-purple-900/40 rounded-2xl px-6 py-5 space-y-2">
              <p className="text-sm text-gray-400">Total Amount</p>
              <p className="text-xl font-semibold">$500.00</p>
            </div>
            <div className="bg-[#1d0f31] border border-purple-900/40 rounded-2xl px-6 py-5 space-y-2">
              <p className="text-sm text-gray-400">Claimed Amount</p>
              <p className="text-xl font-semibold">$250.00</p>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-200">Participants</h2>
            <button className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 transition-colors">
              <Megaphone className="w-5 h-5" />
              <span className="font-medium">Send Reminder</span>
            </button>
          </div>
          <div className="bg-[#1d0f31] border border-purple-900/40 rounded-3xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-900/40 text-sm text-gray-400 uppercase tracking-wide">
                  <th className="px-6 py-4 text-left font-medium">Username</th>
                  <th className="px-6 py-4 text-right font-medium pr-8">Claimed</th>
                  <th className="px-6 py-4 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant) => (
                  <tr
                    key={participant.username}
                    className="border-b border-purple-900/40 last:border-b-0 text-base text-gray-200"
                  >
                    <td className="px-6 py-4">{participant.username}</td>
                    <td className="px-6 py-4 text-right pr-8">{participant.claimed}</td>
                    <td className={`px-6 py-4 text-right font-medium ${statusColor(participant.status)}`}>
                      {statusLabel(participant.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-200">Private Giveaway Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Shareable Link</label>
              <div className="flex items-center gap-3 bg-[#1d0f31] border border-purple-900/40 rounded-2xl px-4 py-3">
                <LinkIcon className="w-5 h-5 text-purple-400" />
                <span className="flex-1 text-gray-200 truncate">{shareLink}</span>
                <button
                  onClick={() => handleCopy(shareLink, 'link')}
                  className="p-2 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copiedField === 'link' && (
                <p className="text-xs text-green-400">Link copied to clipboard.</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">PIN</label>
              <div className="flex items-center gap-3 bg-[#1d0f31] border border-purple-900/40 rounded-2xl px-4 py-3">
                <Lock className="w-5 h-5 text-purple-400" />
                <span className="flex-1 text-gray-200 tracking-[0.4em] text-center md:text-left md:tracking-[0.3em]">
                  {giveawayPin}
                </span>
                <button
                  onClick={() => handleCopy(giveawayPin, 'pin')}
                  className="p-2 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copiedField === 'pin' && (
                <p className="text-xs text-green-400">PIN copied to clipboard.</p>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-200">Giveaway Actions</h2>
          <div className="flex flex-wrap items-center gap-4">
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 transition-colors">
              <PauseCircle className="w-5 h-5" />
              <span className="font-medium">Pause Giveaway</span>
            </button>
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 transition-colors">
              <Power className="w-5 h-5" />
              <span className="font-medium">End Giveaway</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default GiveawayStatus;

