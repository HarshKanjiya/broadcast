import Link from "next/link";
import { Icons } from "../icons/Icons";
import { buttonVariants } from "../ui/Button";
import { getAuthSession } from "@/lib/AuthOptions";
import UserProfile from "./profile/UserProfile";
import SearchBar from "./SearchBar";
import { db } from "@/lib/db";
import NotificationEle from "./profile/Notification";

const NavBar = async ({ }) => {
  const session = await getAuthSession();

  const notifications = await db.notification.findMany({
    where: {
      userId: session?.user.id
    },
    select: {
      post: {
        include: {
          author: {
            select: {
              image: true,
              username: true
            }
          },
          broadcast: {
            select: {
              name: true
            }
          }
        }
      },
      createdAt:true,
      type: true
    },
    orderBy:{
      createdAt:"desc"
    }
  })

  return (
    <div className="py-2 fixed top-0 inset-x-0 h-fit border-b flex justify-between items-center  w-full bg-white z-10 border-zinc-200 ">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2 ">
        <Link href="/" className="flex gap-2 items-center justify-center py-2 ">
          <Icons.Logo
            className="w-8 h-8 sm:w-6 sm:h-6 "
            color="rgb(15,23,42)"
          />
          <p className="hidden md:block font-medium text-zinc-700 ">
            Broad
            <span className="bg-slate-900 font-bold text-white px-2 py-1 mx-1 rounded-sm ">
              Cast
            </span>
          </p>
        </Link>

        <SearchBar />

        {session?.user ? (
          <div className="flex items-center gap-6" >
            <NotificationEle notifications={notifications} />
            <UserProfile user={session?.user} username={session?.user.username || undefined} />
          </div>
        ) : (
          <Link href="/signin" className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

NavBar.displayName = "NavBar";
export default NavBar;
