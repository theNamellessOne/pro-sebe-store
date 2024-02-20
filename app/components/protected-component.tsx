"use client";

import { Role } from "@prisma/client";
import { ReactNode } from "react";
import { useCurrentRole } from "@/hooks/user-current-role";

type ProtectedComponentProps = {
  minimumRequiredRole: Role;
  children: ReactNode;
};

export function ClientProtectedComponent({
  children,
  minimumRequiredRole,
}: ProtectedComponentProps) {
  const userRole = useCurrentRole();

  return determine(minimumRequiredRole, userRole) ? children : <></>;
}

export function determine(minimumRequiredRole: Role, userRole?: Role) {
  if (!userRole) return false;
  if (userRole === Role.OWNER) return true;
  if (minimumRequiredRole === userRole) return true;
  if (userRole === Role.MODERATOR && minimumRequiredRole !== Role.OWNER)
    return true;

  return userRole === Role.PACKAGER && minimumRequiredRole === Role.USER;
}
