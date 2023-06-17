import SignIn from "@/components/layouts/auth/SignIn";
import BackButton from "@/components/ui/BackButton";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="fixed inset-0 bg-zinc-900/20 z-10  ">
      <div className="container  flex items-center h-full mx-auto ">
        <div className=" relative mx-auto mx-w-lg h-fit py-16 bg-white rounded-lg  ">
          <div className="absolute top-4 left-4 ">
            <BackButton />
          </div>
          <SignIn />
        </div>
      </div>
    </div>
  );
};

export default page;
