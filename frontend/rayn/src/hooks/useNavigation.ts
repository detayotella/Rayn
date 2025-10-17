import { useNavigate } from 'react-router';
import { useCallback } from 'react';

/**
 * Custom hook for consistent navigation patterns across the app
 */
export const useAppNavigation = () => {
  const navigate = useNavigate();

  const goToDashboard = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  const goToSend = useCallback(() => {
    navigate('/send');
  }, [navigate]);

  const goToReceive = useCallback(() => {
    navigate('/receive');
  }, [navigate]);

  const goToGiveaway = useCallback(() => {
    navigate('/giveaway');
  }, [navigate]);

  const goToProfile = useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  const goToRewards = useCallback(() => {
    navigate('/rewards');
  }, [navigate]);

  const goToTransactions = useCallback(() => {
    navigate('/transactions');
  }, [navigate]);

  const goToReferrals = useCallback(() => {
    navigate('/referrals');
  }, [navigate]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const goToGiveawayDetails = useCallback((giveawayId: number | string) => {
    navigate(`/giveaway/${giveawayId}`);
  }, [navigate]);

  return {
    goToDashboard,
    goToSend,
    goToReceive,
    goToGiveaway,
    goToProfile,
    goToRewards,
    goToTransactions,
    goToReferrals,
    goBack,
    goToGiveawayDetails,
    navigate, // For custom navigation needs
  };
};
