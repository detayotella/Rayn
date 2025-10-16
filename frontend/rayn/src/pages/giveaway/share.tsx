import React, { useState } from 'react';
import { Copy, X, MessageCircle, Send } from 'lucide-react';

const shareLink = 'rayn.app/g/Y4tD2x';
const giveawayPin = '1984';

const ShareGiveaway: React.FC = () => {
  const [copied, setCopied] = useState<'link' | 'pin' | null>(null);

  const handleCopy = async (value: string, field: 'link' | 'pin') => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f051c] text-white font-DMSans flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl rounded-[32px] border border-purple-900/30 bg-[#160829] shadow-[0_20px_60px_rgba(72,25,129,0.35)] overflow-hidden">
        <header className="flex items-center justify-between px-6 sm:px-8 py-6 border-b border-purple-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-300 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-[#1b0d2e]" />
            </div>
            <span className="text-xl font-semibold">Rayn</span>
          </div>
          <button className="rounded-full p-2 hover:bg-purple-900/40 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </header>

        <main className="px-6 sm:px-8 py-8 space-y-8">
          <section className="text-center space-y-3">
            <h1 className="text-3xl font-semibold">Share your giveaway</h1>
            <p className="text-sm sm:text-base text-gray-400">
              Invite friends to join your giveaway and spread the word!
            </p>
          </section>

          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-purple-300">Shareable Link</p>
            <div className="flex items-center gap-3 rounded-2xl bg-[#1a0c2d] border border-purple-900/40 px-4 py-3">
              <span className="flex-1 text-gray-200 truncate">{shareLink}</span>
              <button
                onClick={() => handleCopy(shareLink, 'link')}
                className="p-2 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copied === 'link' && (
              <p className="text-xs text-green-400">Link copied to clipboard.</p>
            )}
          </section>

          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-purple-300">QR Code</p>
            <div className="rounded-[28px] bg-[#1a0c2d] border border-purple-900/40 p-6">
              <div className="mx-auto max-w-[220px] rounded-[24px] bg-gradient-to-br from-[#1fb6aa] to-[#0f7c86] p-6 shadow-lg">
                <div className="bg-white rounded-2xl p-4 shadow-xl">
                  <svg width="150" height="150" viewBox="0 0 200 200" className="w-full h-full">
                    <rect width="200" height="200" fill="white" />
                    <g fill="black">
                      <rect x="20" y="20" width="40" height="40" />
                      <rect x="140" y="20" width="40" height="40" />
                      <rect x="20" y="140" width="40" height="40" />
                      <rect x="30" y="30" width="20" height="20" fill="white" />
                      <rect x="150" y="30" width="20" height="20" fill="white" />
                      <rect x="30" y="150" width="20" height="20" fill="white" />
                      <rect x="80" y="30" width="10" height="10" />
                      <rect x="100" y="40" width="10" height="10" />
                      <rect x="70" y="60" width="10" height="10" />
                      <rect x="120" y="70" width="10" height="10" />
                      <rect x="90" y="80" width="10" height="10" />
                      <rect x="110" y="90" width="10" height="10" />
                      <rect x="80" y="100" width="10" height="10" />
                      <rect x="130" y="110" width="10" height="10" />
                      <rect x="70" y="120" width="10" height="10" />
                      <rect x="100" y="130" width="10" height="10" />
                      <rect x="90" y="140" width="10" height="10" />
                      <rect x="120" y="150" width="10" height="10" />
                      <rect x="140" y="100" width="10" height="10" />
                      <rect x="160" y="120" width="10" height="10" />
                    </g>
                  </svg>
                  <p className="text-center text-xs mt-3 text-gray-500">Scan</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-purple-300">Share Via</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button className="rounded-2xl bg-[#1a0c2d] border border-purple-900/40 px-4 py-5 flex flex-col items-center gap-3 hover:border-purple-700/40 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#25D366] to-[#1da851] flex items-center justify-center text-black">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium">WhatsApp</span>
              </button>
              <button className="rounded-2xl bg-[#1a0c2d] border border-purple-900/40 px-4 py-5 flex flex-col items-center gap-3 hover:border-purple-700/40 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00b4d8] to-[#0077b6] flex items-center justify-center">
                  <Send className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium">Telegram</span>
              </button>
              <button className="rounded-2xl bg-[#1a0c2d] border border-purple-900/40 px-4 py-5 flex flex-col items-center gap-3 hover:border-purple-700/40 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-xl font-semibold">
                  ...
                </div>
                <span className="text-sm font-medium">More</span>
              </button>
            </div>
          </section>

          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-purple-300">Private Giveaway Pin</p>
            <div className="flex items-center gap-3 rounded-2xl bg-[#1a0c2d] border border-purple-900/40 px-4 py-3">
              <span className="flex-1 text-gray-200 tracking-[0.4em] text-center sm:text-left">
                {giveawayPin}
              </span>
              <button
                onClick={() => handleCopy(giveawayPin, 'pin')}
                className="p-2 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copied === 'pin' && (
              <p className="text-xs text-green-400">PIN copied to clipboard.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default ShareGiveaway;

