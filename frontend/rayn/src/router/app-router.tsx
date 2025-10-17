import React from 'react';
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router";
import { routes } from './routes';
import ProtectedRoute from './protectedRoutes';

// Import all page components
import Home from '../pages/Home';
import Onboarding from '../pages/Onboarding';
import SignIn from '../pages/Login/SignIn';
import Profile from '../pages/Profile/Profile';
import ProfileSummary from '../pages/Profile/ProfileSummary';
import Rewards from '../pages/Rewards';
import Dashboard from "../pages/Dashboard";
import Send from "../pages/Send";
import Receive from "../pages/Receive";
import CommunityGiveaway from "../pages/giveaway";
import GiveawayDetails from "../pages/giveaway/giveawayDetails";
import GiveawayStatus from '../pages/giveaway/giveawayStatus';
import WithdrawGiveaway from '../pages/giveaway/withdraw';
import AnalyticsGiveaway from '../pages/giveaway/analytics';
import ShareGiveaway from '../pages/giveaway/share';
import Referrals from '../pages/Referrals';
import Referred from '../pages/Referrals/Referred';
import SignUp from '../pages/Login/SignUp';
import RedeemReward from '../pages/Referrals/redeemReward';
import SocialFeed from '../pages/SocialFeed';
import CreateGiveaway from '../pages/giveaway/create';
// Component mapping
const componentMap = {
  Home,
  Onboarding,
  Profile,
  ProfileSummary,
  Rewards,
  Dashboard,
  Send,
  Receive,
  CommunityGiveaway,
  GiveawayDetails,
  GiveawayStatus,
  WithdrawGiveaway,
  AnalyticsGiveaway,
  ShareGiveaway,
  Referrals,
  Referred,
  SignUp,
  SignIn,
  RedeemReward,
  SocialFeed,
  CreateGiveaway,
} as const;

// Create router configuration
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {routes.map((route) => {
        const Component = componentMap[route.component as keyof typeof componentMap];
        
        if (route.isIndex) {
          return (
            <Route 
              key={route.name}
              path="/"
              element={
                route.isProtected ? (
                  <ProtectedRoute>
                    <Component />
                  </ProtectedRoute>
                ) : (
                  <Component />
                )
              } 
            />
          );
        }

        return (
          <Route 
            key={route.name}
            path={route.path} 
            element={
              route.isProtected ? (
                <ProtectedRoute>
                  <Component />
                </ProtectedRoute>
              ) : (
                <Component />
              )
            } 
          />
        );
      })}
    </>
  )
);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
