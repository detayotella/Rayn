import React from 'react';
import { ChevronRight, Settings, User2, Wallet } from 'lucide-react';
import Logo from '../../assets/Logo.png';

const totalRedeemableAmount = 25;

const redemptionHistory = [
  {
    title: 'Redeemed $15.00',
    status: 'Completed',
    date: 'July 20, 2024',
  },
  {
    title: 'Redeemed $10.00',
    status: 'Completed',
    date: 'June 15, 2024',
  },
];

export default function RedeemReward(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-[#0c0217] text-white font-DMSans">
      <header className="border-b border-purple-900/30 bg-[#120426]">
        <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-8 lg:px-16">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Rayn logo" className="h-8 w-8 object-contain" />
            <span className="text-base sm:text-lg font-semibold">Rayn</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-purple-900/50 hover:bg-purple-800/70 transition-colors"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-800">
              <User2 className="h-5 w-5" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 sm:px-8 lg:px-16 py-10 sm:py-14 space-y-8">
        <section className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold">Redeem Rewards</h1>
          <div className="rounded-[28px] bg-gradient-to-br from-[#1d0640] via-[#190230] to-[#12011f] border border-purple-900/40 shadow-[0_30px_80px_rgba(102,51,204,0.35)] p-6 sm:p-8">
            <div className="space-y-2 text-center sm:text-left">
              <p className="text-sm uppercase tracking-wide text-purple-200/70">Total Redeemable Amount</p>
              <p className="text-4xl sm:text-5xl font-semibold">${totalRedeemableAmount.toFixed(2)}</p>
              <p className="text-xs sm:text-sm text-gray-300">
                Minimum redemption is $10.00. Network fees may apply.
              </p>
            </div>

            <div className="mt-6 flex justify-center sm:justify-start">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold shadow-[0_15px_40px_rgba(128,90,213,0.45)] transition-transform hover:scale-[1.02]"
              >
                Redeem Now
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Redemption History</h2>
          <div className="space-y-3">
            {redemptionHistory.map(({ title, status, date }) => (
              <div
                key={title}
                className="flex items-center justify-between rounded-3xl bg-gradient-to-br from-[#1d073a] to-[#16022a] border border-purple-900/40 px-5 py-4 sm:px-7 sm:py-5 shadow-[0_20px_60px_rgba(102,51,204,0.2)]"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-900/40">
                    <Wallet className="h-5 w-5 text-purple-200" />
                  </span>
                  <div className="space-y-1">
                    <p className="text-base sm:text-lg font-semibold text-gray-100">{title}</p>
                    <p className="text-xs sm:text-sm text-gray-400">{status}</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-300">{date}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
