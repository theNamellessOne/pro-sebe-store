export const DEFAULT_LOGIN_REDIRECT = "/home";
export const API_AUTH_PREFIX = "/api/auth";

export const PUBLIC_ROUTES = [
  "",
  "/",
  "/home",
  "/catalogue",
  "/cart",
  "/checkout",
  "/reviews",
];

export const USER_ROUTES = [...PUBLIC_ROUTES, "/user-page"];

export const PACKAGER_ROUTES = [...USER_ROUTES, "/dashboard/orders"];

export const MODERATOR_ROUTES = [
  ...PACKAGER_ROUTES,
  "/dashboard/banners",
  "/dashboard/colors",
  "/dashboard/sizes",
  "/dashboard/review",
  "/dashboard/products",
  "/dashboard/categories",
];
