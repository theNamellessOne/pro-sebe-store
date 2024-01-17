import { Role } from "@prisma/client";
import { DEFAULT_LOGIN_REDIRECT, PUBLIC_ROUTES, USER_ROUTES } from "@/routes";
import authConfig from "@/auth/auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/api/mail")) return null;

  const { nextUrl } = req;
  const res = await fetch(
    `http://localhost:3000/api/users/${req.auth?.user.email}`,
  );
  const user = await res.json();

  if (pathname.startsWith("/api/users")) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isApiAuthRoute = pathname.startsWith("/api/auth");
  const isAuthRoute = pathname.startsWith("/auth");

  const isLoggedIn = !!user?.role;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isUserRoute = USER_ROUTES.includes(pathname);

  let callbackUrl = nextUrl.pathname;
  if (nextUrl.search) {
    callbackUrl += nextUrl.search;
  }
  const encodedCallbackUrl = encodeURIComponent(callbackUrl);

  if (!isLoggedIn && !isPublicRoute && !isAuthRoute && !isApiAuthRoute)
    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
    );

  if (isApiAuthRoute) return null;

  if (isAuthRoute) {
    return !isLoggedIn
      ? null
      : Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (isPublicRoute) return null;
  if (isUserRoute && isLoggedIn) return null;
  if (user?.role === Role.OWNER) return null;

  if (isDashboardRoute) {
    const role = user?.role;

    if (role === Role.PACKAGER && pathname.startsWith("/dashboard/orders"))
      return null;
    if (role === Role.MODERATOR && !pathname.startsWith("/dashboard/users"))
      return null;

    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
