import {UserDataForm} from "@/app/(client)/user-page/(pages)/user-data/components/user-data-form";
import {PasswordForm} from "@/app/(client)/user-page/(pages)/user-data/components/password-form";


export default async function UserPage() {
  return(
      <>
          <UserDataForm/>
          <PasswordForm/>
      </>
  );
}