export interface RouteConfig {
  path: string;
  name: string;
  component: string;
  isProtected?: boolean;
  isIndex?: boolean;
}

export const routes: RouteConfig[] = [
  {
    path: "/",
    name: "Home",
    component: "Home",
    isIndex: true,
  },
  {
    path: "/onboarding",
    name: "Onboarding",
    component: "Onboarding",
  },
  {
    path: "/choose-username",
    name: "ChooseUsername",
    component: "ChooseUsernamePage",
  },
  {
    path: "/rewards",
    name: "Rewards",
    component: "Rewards",
    isProtected: true,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: "Dashboard",
    isProtected: true,
  },
  {
    path: "/send",
    name: "Send",
    component: "Send",
    isProtected: true,
  },
  {
    path: "/receive",
    name: "Receive",
    component: "Receive",
    isProtected: true,
  },
  {
    path: "/giveaways",
    name: "Giveaways",
    component: "CommunityGiveaway",
    isProtected: true,
  },
  {
    path: "/giveaway",
    name: "GiveawayDetails",
    component: "GiveawayDetails",
    isProtected: true,
  },
  {
    path: "/giveawaystatus",
    name: "GiveawayStatus",
    component: "GiveawayStatus",
    isProtected: true,
  },
  {
    path: "/withdraw",
    name: "WithdrawGiveaway",
    component: "WithdrawGiveaway",
    isProtected: true,
  },
  {
    path: "/analytics",
    name: "AnalyticsGiveaway",
    component: "AnalyticsGiveaway",
    isProtected: true,
  },
  {
    path: "/share",
    name: "ShareGiveaway",
    component: "ShareGiveaway",
    isProtected: true,
  },
];

export const publicRoutes = routes.filter(route => !route.isProtected);
export const protectedRoutes = routes.filter(route => route.isProtected);
