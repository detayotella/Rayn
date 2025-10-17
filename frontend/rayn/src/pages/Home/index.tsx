import React, { useState } from 'react';
import Navigation from '../../components/modules/Home/Navigation';
import HeroSection from '../../components/modules/Home/HeroSection';
import FeaturesSection from '../../components/modules/Home/FeaturesSection';
import TestimonialsSection from '../../components/modules/Home/TestimonialsSection';
import CTASection from '../../components/modules/Home/CTASection';
import NewsletterSection from '../../components/modules/Home/NewsletterSection';
import Footer from './Footer';
import { testimonials } from '../../data/testimonials';


export default function Home() {
  const [email, setEmail] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const handleSubscribe = (): void => {
    if (email) {
      alert(`Subscribed with: ${email}`);
      setEmail('');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  return (
    <div className="min-h-screen bg-[#191022] text-white font-DMSans">
      <Navigation 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection />
      <NewsletterSection 
        email={email}
        handleEmailChange={handleEmailChange}
        handleSubscribe={handleSubscribe}
      />
      <Footer />
    </div>
  );
}
