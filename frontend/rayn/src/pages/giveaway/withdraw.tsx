import React from 'react';
import { EllipsisVertical } from 'lucide-react';

const unclaimedAmount = '125.50';
const currency = 'USDC';
const networkFee = '0.25';

const WithdrawGiveaway: React.FC = () => {
  const netAmount = (parseFloat(unclaimedAmount) - parseFloat(networkFee)).toFixed(2);

  return (
    <div className="min-h-screen bg-[#0f051c] text-white font-DMSans">
      {/* Header */}
      <header className="border-b border-purple-900/20 bg-[#140825]/90">
        <div className=" mx-10 flex items-center justify-between px-4 sm:px-6 lg:px-0 py-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 grid place-items-center rounded-full bg-gradient-to-br from-purple-600 to-purple-400">
              <div className="w-6 h-6 rounded-full bg-white/90" />
            </div>
            <span className="text-xl font-semibold">Rayn</span>
          </div>

          <button className="p-2 rounded-full hover:bg-purple-900/40 transition-colors">
            <EllipsisVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-0 py-12 sm:py-16 space-y-10 text-center">
        <section className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-semibold">Withdraw Unclaimed Funds</h1>
          <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
            The giveaway has ended. Withdraw the unclaimed funds to your Rayn wallet.
          </p>
        </section>

        <section className="max-w-md mx-auto">
          <div className="rounded-[28px] bg-[#1b0d2e] border border-purple-900/40 px-8 py-6 space-y-4 shadow-[0_18px_60px_rgba(72,25,129,0.35)]">
            <span className="block text-xs tracking-[0.3em] text-purple-300 uppercase">Unclaimed Amount</span>
            <div className="flex flex-wrap items-baseline justify-center gap-2">
              <span className="text-5xl font-semibold">{unclaimedAmount}</span>
              <span className="text-xl text-gray-400">{currency}</span>
            </div>
          </div>
        </section>

        <section className="max-w-md mx-auto">
          <div className="rounded-[28px] bg-[#1b0d2e] border border-purple-900/40 px-8 py-6 space-y-6 text-left shadow-[0_18px_60px_rgba(72,25,129,0.35)]">
            <h2 className="text-lg font-semibold">Withdrawal Details</h2>
            <div className="space-y-4 text-sm sm:text-base">
              <div className="flex items-center justify-between text-gray-300">
                <span>Withdrawal Amount</span>
                <span>{unclaimedAmount} {currency}</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span>Network Fee</span>
                <span>{networkFee} {currency}</span>
              </div>
              <div className="flex items-center justify-between text-purple-200 font-medium pt-2 border-t border-purple-900/40">
                <span>You will receive</span>
                <span className="text-purple-300">{netAmount} {currency}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-md mx-auto">
          <button className="w-full rounded-[32px] bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 transition-transform transform hover:scale-[1.01] px-6 py-4 font-semibold text-base sm:text-lg shadow-[0_18px_60px_rgba(98,45,177,0.35)]">
            Confirm Withdrawal
          </button>
        </section>
      </main>
    </div>
  );
};

export default WithdrawGiveaway;

