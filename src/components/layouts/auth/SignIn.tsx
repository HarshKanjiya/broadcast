import { FC } from "react";
import { Icons } from "../../icons/Icons";
import Link from "next/link";
import AuthForm from "./AuthForm";

const SignIn: FC = ({}) => {
  return (
    <div className="container mx-auto flex flex-col w-full justify-center space-y-6 sm:w[400px]  ">
      <div className="flex flex-col space-y-2 items-center text-center">
        <Icons.Logo className="mx-auto w-6 h-6 " />
        <h1 className="text-2xl font-semibold tracking-wide ">Welcome Back!</h1>
        <p className="text-sm mx-auto max-w-xs">
          By continuing, you agree to our User Agreement and Privacy Policy.
        </p>

        <AuthForm />

        <p className="px-8 text-center text-sm text-zinc-700 ">
          New to Broadcast? &nbsp; &nbsp; &nbsp;
          <Link
            href="/signup"
            className=" hover:text-zinc-900 text-sm underline underline-offset-4  "
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

SignIn.displayName = "SignIn";
export default SignIn;
