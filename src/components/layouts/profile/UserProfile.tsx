import { User } from "next-auth";
import { FC } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/DropdownMenu";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import SignOutButton from "@/components/ui/SignOutButton";

interface UserProfileProps {
  user: Pick<User, "name" | "email" | "image">;
  username: string | undefined
}

const UserProfile: FC<UserProfileProps> = ({ user, username }) => {
  return (
    <div className="flex items-center gap-5 sm:gap-8 ">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar
            user={{ name: user.name || null, image: user.image || null }}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white" align="end">
          <div className="flex flex-col space-y-1 p-2 ">
            <div className="flex flex-col space-y-1 leading-none ">
              {username ? <p className=" font-medium ">{username}</p> : <p className=" font-medium ">{user?.name}</p>}
              {user?.email && (
                <p className=" w-[200px] truncate text-sm text-zinc-700 ">
                  {user?.email}
                </p>
              )}
            </div>
          </div>

          <DropdownMenuSeparator />
          <div className="flex flex-col space-y-1 p-2 ">
            <DropdownMenuItem asChild>
              <Link href="/">Feed</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/broadcast/create">Create Community</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator />
          <div className="flex flex-col space-y-1 p-1 ">
            <SignOutButton />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

UserProfile.displayName = "UserProfile";
export default UserProfile;
