"use client"

import { PasswordForm } from "./password-form";
import { UserDataForm } from "./user-data-form";
import {useSession} from "next-auth/react";

export function UserDataTab() {
  return (
    <>
      <UserDataForm />
        {!(useSession().data?.user.isOAuth) && <PasswordForm />}
    </>
  );
}
