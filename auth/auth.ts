import NextAuth from "next-auth";
import authConfig from "@/auth/auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);
