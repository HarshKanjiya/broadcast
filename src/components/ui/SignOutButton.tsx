"use client";

import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "./Button";

const SignOutButton = () => {

  return (
    <Button
      onClick={() =>
        signOut().then(() => {
          redirect("/signin")
        })
      }
    >
      SIGN OUT
    </Button>
  );
};

export default SignOutButton;
