import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { loginSchema } from "@/schema/auth/login-schema";
import { NextAuthConfig } from "next-auth";
import prisma from "@/lib/prisma";
import { UserSelectDto } from "@/service/user/impl/type";
import { compare } from "bcryptjs";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
} satisfies NextAuthConfig;
