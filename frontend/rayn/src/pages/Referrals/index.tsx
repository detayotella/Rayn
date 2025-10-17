import React, { useState } from 'react';
import { X, Share2, Copy, MessageCircle, Link as LinkIcon, UserPlus, Gift } from 'lucide-react';
import Logo from '../../assets/Logo.png';

const referralLink = 'https://rayn.app/invite/your-code';

const XBrandIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.94-6.462-5.656 6.462H2.263l7.727-8.827L1.877 2.25h5.69l4.459 5.888 6.218-5.888Zm-1.16 17.52h1.834L7.084 4.596H5.117l11.967 15.174Z" />
  </svg>
);

interface ShareAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const shareActions: ShareAction[] = [
  { label: 'Share', icon: Share2 },
  { label: 'Copy', icon: Copy },
  { label: 'X', icon: XBrandIcon },
  { label: 'Whatsapp', icon: MessageCircle },
];

const howItWorksSteps = [
  {
    icon: Share2,
    title: '1. Share Your Link',
    description: 'Share your unique referral link with friends.',
  },
  {
    icon: UserPlus,
    title: '2. Friend Signs Up',
    description: 'Your friend signs up using your link.',
  },
  {
    icon: Gift,
    title: '3. Earn Rewards',
    description: 'You both receive a reward after their first transaction.',
  },
] as const;

export default function Referrals(): React.JSX.Element {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyLink = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy referral link', error);
    }
  };

  const encodedReferralLink = encodeURIComponent(referralLink);
  const shareMessage = encodeURIComponent('Join me on Rayn and earn rewards when you complete your first transaction!');

  const handleShareActionClick = (label: string): void => {
    if (label === 'Copy') {
      void handleCopyLink();
      return;
    }

    if (label === 'X') {
      window.open(`https://twitter.com/intent/tweet?text=${shareMessage}&url=${encodedReferralLink}`, '_blank', 'noopener,noreferrer');
      return;
    }

    if (label === 'Whatsapp') {
      window.open(`https://wa.me/?text=${shareMessage}%20${encodedReferralLink}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0316] text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 font-DMSans">
      <div className="w-full max-w-3xl bg-gradient-to-b from-[#160733] via-[#12042a] to-[#0b0216] border border-purple-900/40 rounded-[32px] shadow-[0_40px_120px_rgba(96,37,210,0.35)] overflow-hidden">
        {/* Header */}
        <header className="px-5 sm:px-8 py-5 border-b border-purple-900/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Rayn logo" className="h-8 w-8 object-contain" />
            <span className="text-sm sm:text-base font-semibold text-gray-200">Rayn</span>
          </div>
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-900/40 hover:bg-purple-800/60 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <main className="px-5 sm:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10">
          <section className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold">Invite friends, earn rewards</h1>
            <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base">
              Invite your friends to Rayn and earn rewards when they make their first transaction. It&apos;s a win-win!
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm uppercase tracking-wide text-gray-400">Your Referral Link</h2>
            <div className="flex flex-col sm:flex-row items-stretch gap-3 bg-[#1a0b35] border border-purple-900/50 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-3 text-left">
                <LinkIcon className="w-4 h-4 text-purple-300" />
                <p className="text-sm sm:text-base text-gray-200 break-all">{referralLink}</p>
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="sm:ml-auto inline-flex items-center justify-center gap-2 bg-purple-700/30 hover:bg-purple-700/50 text-purple-200 px-4 py-2 rounded-2xl transition-colors text-sm sm:text-base"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy link'}
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm uppercase tracking-wide text-gray-400">Share Your Link</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {shareActions.map(({ label, icon: Icon }) => (
                <button
                  type="button"
                  key={label}
                  onClick={() => handleShareActionClick(label)}
                  className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-[#1a0b35] border border-purple-900/40 hover:border-purple-700/60 hover:bg-purple-900/20 transition-colors py-5"
                >
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-sm font-medium text-gray-200">{label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm uppercase tracking-wide text-gray-400">Your Earnings</h2>
            <div className="rounded-3xl bg-gradient-to-r from-[#7a2bff] via-[#8d34ff] to-[#c03afd] px-6 py-6 shadow-[0_25px_60px_rgba(144,51,255,0.45)]">
              <p className="text-sm text-purple-100/80">Total Earned</p>
              <p className="text-3xl sm:text-4xl font-semibold">$50.00</p>
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="text-lg font-semibold">How it Works</h2>
            <div className="space-y-4">
              {howItWorksSteps.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1a0b35] border border-purple-900/40">
                    <Icon className="w-4 h-4 text-purple-200" />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm sm:text-base font-semibold">{title}</p>
                    <p className="text-sm text-gray-300">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
