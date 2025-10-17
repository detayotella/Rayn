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
    path: "/sign-in",
    name: "SignIn",
    component: "SignIn",
  },
  {
    path: "/sign-up",
    name: "SignUp",
    component: "SignUp",
  },
  {
    path: "/profile",
    name: "Profile",
    component: "Profile",
  },
  {
    path: "/profile-summary",
    name: "ProfileSummary",
    component: "ProfileSummary",
    isProtected: true,
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
    path: "/giveaway",
    name: "Giveaway",
    component: "CommunityGiveaway",
    isProtected: true,
  },
  {
    path: "/giveaway/:id",
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
  {
    path: "/referrals",
    name: "Referrals",
    component: "Referrals",
    isProtected: true,
  },
  {
    path: "/referred",
    name: "Referred",
    component: "Referred",
    isProtected: true,
  },
  {
    path: "/redeem-reward",
    name: "RedeemReward",
    component: "RedeemReward",
    isProtected: true,
  },
  {
    path: "/feed",
    name: "SocialFeed",
    component: "SocialFeed",
    isProtected: true,
  },
  {
    path: "/giveaway/create",
    name: "CreateGiveaway",
    component: "CreateGiveaway",
    isProtected: true,
  },
];

export const publicRoutes = routes.filter(route => !route.isProtected);
export const protectedRoutes = routes.filter(route => route.isProtected);
