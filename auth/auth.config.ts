import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { loginSchema } from "@/schema/auth/login-schema";
import { NextAuthConfig } from "next-auth";
import prisma from "@/lib/prisma";
import { UserSelectDto } from "@/service/user/impl/type";
import { compare } from "bcryptjs";
import { UserService } from "@/service/user/user-service";
import { Role } from "@prisma/client";
import { TokenService } from "@/service/token/token-service";
import { PrismaAdapter } from "@auth/prisma-adapter";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Credentials",
      async authorize(credentials, _) {
        if (!credentials) return null;

        const validatedFields = loginSchema.safeParse(credentials);
        if (!validatedFields.success) return null;

        const input = validatedFields.data;

        const user = await prisma.user.findUnique({
          where: { email: input.email },
          select: { ...UserSelectDto, password: true },
        });

        if (!user) return null;
        if (!user.password) return null;

        if (!(await compare(input.password, user.password))) {
          return null;
        }

        let { password, ...res } = user;

        return res;
      },
    }),
  ],
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

      if (token.username && session.user) {
        session.user.username = token.username as string;
      }

      return session;
    },
    async jwt(props) {
      const token = props.token;
      if (!token.sub) return token;

      if (props.trigger === "update") {
        token.username = props.session.username;
      }

      if (props.user) {
        //@ts-ignore
        token.role = props.user.role;
        //@ts-ignore
        token.username = props.user.username;
      }

      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;
