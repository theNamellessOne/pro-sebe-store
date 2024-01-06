"use client";

import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";

type ProtectedComponentProps = {
  minimumRequiredRole: Role;
  children: ReactNode;
};

export function ClientProtectedComponent({
  children,
  minimumRequiredRole,
}: ProtectedComponentProps) {
  const { data } = useSession();
  const userRole = data?.user.role;

  if (!userRole) return null;
  if (determine(minimumRequiredRole, userRole)) return children;

  return null;
}

function determine(minimumRequiredRole: Role, userRole: Role) {
  if (userRole === "OWNER") return true;
  if (minimumRequiredRole === userRole) return true;
  if (userRole === "MODERATOR" && minimumRequiredRole !== "OWNER") return true;
  if (userRole === "PACKAGER" && minimumRequiredRole === "USER") return true;

  return false;
}
