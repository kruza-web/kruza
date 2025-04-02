"use client";

import { Button, ButtonProps } from "./ui/button";
import {signIn} from "next-auth/react";
import { cn } from "@/lib/utils";

export const SignIn = ({ redirect = "" }: { redirect?: string }) => {
  const handleSignIn = async () => {
    await signIn("google", redirect ? { callbackUrl: redirect } : {});
  };

  return (
      <Button onClick={handleSignIn} className={cn("w-full")} variant="outline" size="lg" disabled={false} >
        Entrar
      </Button>
  );
};