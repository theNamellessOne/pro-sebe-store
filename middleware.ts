import { Role } from "@prisma/client";
import { DEFAULT_LOGIN_REDIRECT, PUBLIC_ROUTES, USER_ROUTES } from "@/routes";
import NextAuth from "next-auth";
import authConfig from "@/auth/auth.config";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/api/mail")) return;
  if (pathname.startsWith("/api/uploadthing")) return;

  const { nextUrl } = req;
  const user = req.auth?.user;

  if (pathname === "/api/users/export" && user?.role === Role.OWNER) return;

  if (pathname.startsWith("/api/users")) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isApiAuthRoute = pathname.startsWith("/api/auth");
  const isAuthRoute = pathname.startsWith("/auth");
  const isCatalogueRoute = pathname.startsWith("/catalogue");

  const isLoggedIn = !!user?.role;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname) || isCatalogueRoute;
  const isUserRoute = USER_ROUTES.includes(pathname);

  let callbackUrl = nextUrl.pathname;
  if (nextUrl.search) {
    callbackUrl += nextUrl.search;
  }
  const encodedCallbackUrl = encodeURIComponent(callbackUrl);

  if (!isLoggedIn && !isPublicRoute && !isAuthRoute && !isApiAuthRoute) {
    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
    );
  }

  if (isApiAuthRoute) return;

  if (isAuthRoute) {
    if (!isLoggedIn) return;
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (isPublicRoute) return;
  if (isUserRoute && isLoggedIn) return;
  if (user?.role === Role.OWNER) return;

  if (isDashboardRoute) {
    const role = user?.role;

    if (role === Role.PACKAGER && pathname.startsWith("/dashboard/orders"))
      return;
    if (role === Role.MODERATOR && !pathname.startsWith("/dashboard/users"))
      return;

    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
