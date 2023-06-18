"use client";
import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";
import UserAvatar from "../profile/UserAvatar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageIcon, Link2 } from "lucide-react";

interface CreatePostCompProps {
  session: Session | null;
}

const CreatePostComp: FC<CreatePostCompProps> = ({ session }) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <li className=" overflow-hidden rounded-md bg-white list-none shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] ">
      <div className=" h-full px-4 sm:px-6 py-4 flex justify-between gap-4 sm:gap-6 ">
        <div className="relative">
          <UserAvatar
            user={{
              name: session?.user.name || null,
              image: session?.user.image,
            }}
          />
          <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-emerald-500 outline outline-2 outline-white " />
        </div>
        <Input
          readOnly
          className="cursor-pointer"
          onClick={() => router.push(pathname + "/submit")}
          placeholder="Create Post"
        />
        <Button
          variant="ghost"
          onClick={() => router.push(pathname + "/submit")}
        >
          <ImageIcon className="text-zinc-600" />
        </Button>
        <Button
          className="hidden sm:block"
          variant="ghost"
          onClick={() => router.push(pathname + "/submit")}
        >
          <Link2 className="h-5 w-5 text-zinc-600" />
        </Button>
      </div>
    </li>
  );
};

CreatePostComp.displayName = "CreatePostComp";
export default CreatePostComp;
