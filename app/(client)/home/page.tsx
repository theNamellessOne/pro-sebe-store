"use client";

import { Header } from "../components/header/header";
import { Button } from "@nextui-org/button";
import { AuthService } from "@/service/auth/auth-service";
import { LogOut } from "lucide-react";
import React from "react";

export default function Page() {
  return (
    <div>
      <Header />
      <Button
        color={"danger"}
        variant={"light"}
        onClick={() => {
          AuthService.instance.logout();
        }}
      >
        <LogOut /> Logout
      </Button>
    </div>
  );
}
