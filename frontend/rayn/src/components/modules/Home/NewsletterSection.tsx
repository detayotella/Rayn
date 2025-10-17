import React from 'react';

interface NewsletterSectionProps {
  email: string;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubscribe: () => void;
}

export default function NewsletterSection({ email, handleEmailChange, handleSubscribe }: NewsletterSectionProps) {
  return (
    <section className="bg-[#191022] py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-[#2A1A3E] rounded-3xl p-12 border border-purple-700/30 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">Stay in the loop</h2>
          <p className="text-gray-300 mb-8">
            Subscribe to our newsletter for the latest updates, news, and exclusive content about Rayn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-2xl bg-[#191022] border border-purple-700/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleSubscribe}
              className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-2xl font-medium transition text-white whitespace-nowrap"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
