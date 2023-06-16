"use client";
import { Icons } from "@/components/icons/Icons";
import { Button } from "@/components/ui/Button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { FC } from "react";
import { toast } from "react-hot-toast";

const AuthForm: FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const lol = () => toast.success("erth")

  const HelperSignin = (action: string) => {
    setIsLoading(true);
    try {
      signIn(action, { redirect: false }).then((callback) => {
        if (callback?.error) {
          toast.error("Invalid credentials!");
        }

        if (callback?.ok) {
          router.push("/");
        }
      });
    } catch (err: any) {
      toast.error(err?.message ? err?.message : "Something went Wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center flex-col gap-3 py-2 ">
      <button onClick={lol} >qwertyuiuytrew</button>
      <Button
        size="sm"
        isLoading={isLoading}
        className="w-full flex items-center gap-3 px-5 hover:bg-black  "
        onClick={() => HelperSignin("google")}
      >
        {!isLoading && <Icons.GoogleLogo className="h-5 w-5" />}
        Sign in with Google
      </Button>

      
      {/* <Button
        size="sm"
        isLoading={isLoading}
        className="w-full flex items-center gap-3 px-5 bg-[#573a81] hover:bg-[#462579] "
        onClick={() => HelperSignin("github")}
      >
        {!isLoading && <Icons.GithubLogo className="h-5 w-5" />}
        Sign in with Github
      </Button> */}
    </div>
  );
};

AuthForm.displayName = "AuthForm";
export default AuthForm;
