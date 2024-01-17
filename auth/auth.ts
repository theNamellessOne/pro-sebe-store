import NextAuth from "next-auth";
import prisma from "@/lib/prisma";
import authConfig from "@/auth/auth.config";
import { Role } from "@prisma/client";
import { UserService } from "@/service/user/user-service";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { TokenService } from "@/service/token/token-service";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update,
} = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
    //error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const { value } = await UserService.instance.fetchById(user.id);

      if (!value?.emailVerified) return false;

      if (value.role !== Role.USER) {
        const twoFactorConfirmation =
          await TokenService.instance.getTwoFactorConfirmationByUserId(
            value.id,
          );

        if (!twoFactorConfirmation) return false;

        await prisma.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as Role;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;

        session.user.role = token.role as Role;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const response = await UserService.instance.fetchById(token.sub);

      if (!response.value) return token;

      const usr = response.value;
      const existingAccount = UserService.instance.fetchAccountByUserId(usr.id);

      token.name = usr.name;
      token.role = usr.role;
      token.email = usr.email;
      token.phone = usr.phone;
      token.username = usr.username;
      token.isOAuth = !!existingAccount;

      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
