"use client";

import { UserService } from "@/service/user/user-service";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

export default async function UserData() {
  const session = useSession();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const id = session.data?.user.id;
    if (!id) return;

    UserService.instance.fetchById(id).then((res) => {
      if (res.errMsg) return;

      setUserData(res.value);
    });
  }, [session]);

  return (
    <div className="px-[20%] pt-[15px] flex">
      {userData && (
        <div className={"flex flex-col"}>
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
          <p>Phone: {userData.phone}</p>
          <p>Username: {userData.username}</p>
        </div>
      )}
    </div>
  );
}
