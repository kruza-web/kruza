"use client";

import { Button, ButtonProps } from "./ui/button";
import {signOut} from "next-auth/react";
import { cn } from "@/lib/utils";

export const SignOut = ({ redirect = "/" }: { redirect?: string }) => {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
      <Button onClick={handleSignOut} className={cn("w-full")} variant="outline" size="lg" disabled={false} >
        Cerrar session
      </Button>
  );
};