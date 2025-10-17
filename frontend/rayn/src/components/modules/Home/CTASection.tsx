export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-700/50 via-purple-600/50 to-purple-900/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-16 text-center text-white">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
          Experience seamless stablecoin transfers.
        </h2>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-purple-100 mb-8">
          Join the Rayn community and start sending and receiving stablecoins instantly with a
          mobile-first experience built for emerging markets.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/onboarding"
            className="bg-white text-purple-700 px-8 py-3 rounded-2xl font-semibold shadow-lg shadow-purple-900/40 transition-transform hover:scale-105"
          >
            Get Started
          </a>
          <a
            href="/community-giveaway"
            className="border border-white/60 text-white px-8 py-3 rounded-2xl font-semibold transition-colors hover:bg-white/10"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
