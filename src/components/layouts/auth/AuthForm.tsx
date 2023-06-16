"use client";
import { Icons } from "@/components/icons/Icons";
import { Button } from "@/components/ui/Button";
import { signIn } from "next-auth/react";
import React, { FC } from "react";
import { toast } from "react-hot-toast";

const AuthForm: FC = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const HelperGoogleLogin = () => {
    setIsLoading(true);
    try {
      throw "lol err";
      signIn("google");
    } catch (err: any) {
      toast.error(err?.message ? err?.message : "Something went Wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <Button
        size="sm"
        isLoading={isLoading}
        className="w-full flex items-center gap-3 px-5  "
        onClick={HelperGoogleLogin}
      >
        {!isLoading && <Icons.GoogleLogo className="h-5 w-5" />}
        Sign in with Google
      </Button>
    </div>
  );
};

AuthForm.displayName = "AuthForm";
export default AuthForm;
