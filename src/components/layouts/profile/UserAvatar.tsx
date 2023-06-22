import { Icons } from "@/components/icons/Icons";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { AvatarProps } from "@radix-ui/react-avatar";
import { User } from "next-auth";
import Image from "next/image";
import { FC } from "react";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "image" | "name">;
}

const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
    <Avatar className="flex justify-center items-center " {...props}>
      {user.image ? (
        <div className="w-full h-full aspect-square relative ">
          <Image
            fill
            src={user.image}
            referrerPolicy="no-referrer"
            alt="User Profile"
          />
        </div>
      ) : (
        <AvatarFallback>
          <Icons.User className="h-6 w-6" color="#b1b1b1" />
          <span className="sr-only">{user?.name}</span>
        </AvatarFallback>
      )}
    </Avatar>
  );
};

UserAvatar.displayName = "UserAvatar";
export default UserAvatar;
