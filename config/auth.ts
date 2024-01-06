import { AuthOptions } from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { User } from "@prisma/client";

export const authConfig: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      try {
        const { password, ...userWithoutPassword } = user as User;
        return { ...token, ...userWithoutPassword };
      } catch {
        return { ...token, ...user };
      }
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },

  // @ts-ignore
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
};
