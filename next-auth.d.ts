import { Role } from "@prisma/client";
import { DefaultSession } from "next-auth";

export type ExtendedTypes = {
  id: string;
  role: Role;
  isOAuth: boolean;
  username: string;
  surname: string;
  phone: string;
  patronymic: string;
};

export type ExtendedUser = DefaultSession["user"] & ExtendedTypes;
declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

export type ExtendedJwt = DefaultSession["jwt"] & ExtendedTypes;
declare module "next-auth/jwt" {
  interface JWT extends ExtendedJwt {}
}
