"use client";

import { signOut } from "next-auth/react";
import { Button } from "./Button";
import { useRouter } from "next/navigation";

const SignOutButton = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() =>
        signOut().then(() => {
          router.push("/signin");
        })
      }
    >
      SIGN OUT
    </Button>
  );
};

export default SignOutButton;
