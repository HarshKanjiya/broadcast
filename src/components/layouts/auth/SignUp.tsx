import { FC } from "react";
import { Icons } from "../../icons/Icons";
import Link from "next/link";
import AuthForm from "./AuthForm";

const SignUp: FC = ({}) => {
  return (
    <div className="container mx-auto flex flex-col w-full justify-center space-y-6 sm:w[400px]  ">
      <div className="flex flex-col space-y-2 items-center text-center">
        <Icons.Logo className="mx-auto w-6 h-6 " />
        <h1 className="text-2xl font-semibold tracking-wide ">
          Let&apos;s start a New Journey
        </h1>
        <p className="text-sm mx-auto max-w-xs">
          By continuing, you agree to our User Agreement and Privacy Policy.
        </p>

        <AuthForm />

        <p className="px-8 text-center text-sm text-zinc-700 ">
          Already a Broadcaster? &nbsp; &nbsp; &nbsp;
          <Link
            href="/signin"
            className=" hover:text-zinc-900 text-sm underline underline-offset-4  "
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

SignUp.displayName = "SignUp";
export default SignUp;
