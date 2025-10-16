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
import ChooseUsernamePage from '../pages/ChooseUserName';
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
// Component mapping
const componentMap = {
  Home,
  Onboarding,
  ChooseUsernamePage,
  Rewards,
  Dashboard,
  Send,
  Receive,
  CommunityGiveaway,
  GiveawayDetails,
  GiveawayStatus,
  WithdrawGiveaway,
  AnalyticsGiveaway,
  ShareGiveaway
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
