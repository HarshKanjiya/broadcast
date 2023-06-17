"use client";

import { FC } from "react";
import { Button } from "./Button";
import { Icons } from "../icons/Icons";
import { useRouter } from "next/navigation";

const BackButton: FC = ({}) => {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      aria-label="close modal"
      onClick={() => {
        router.back();
      }}
      className=" inline-flex items-center p-0 aspect-square focus:ring-0"
    >
      <Icons.Back className="h-6 w-6" />
    </Button>
  );
};

BackButton.displayName = "BackButton";
export default BackButton;
