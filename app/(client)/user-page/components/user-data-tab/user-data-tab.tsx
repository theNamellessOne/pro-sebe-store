import { PasswordForm } from "./password-form";
import { UserDataForm } from "./user-data-form";

export function UserDataTab() {
  return (
    <>
      <UserDataForm />
      <PasswordForm />
    </>
  );
}
