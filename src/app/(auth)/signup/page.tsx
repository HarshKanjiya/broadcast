import { Icons } from "@/components/icons/Icons";
import SignUp from "@/components/layouts/auth/SignUp";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className=" absolute inset-0  ">
      <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "self-start -mt-20 flex items-center justify-center gap-1 "
          )}
        >
          <Icons.Back className="h-4 w-4" />
          <p>Back</p>
        </Link>

        <SignUp />
      </div>
    </div>
  );
};

page.displayName = "page";
export default page;
