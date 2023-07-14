import UserNameForm from "@/components/layouts/settings/UserNameForm";
import { AuthOptions, getAuthSession } from "@/lib/AuthOptions";
import { redirect } from "next/navigation";

export const metadata = {
  title: "settings",
  description: "Update your user name"
}

const page = async () => {
  const session = await getAuthSession()

  if (!session?.user) redirect(AuthOptions.pages?.signIn || "/signin")



  return <div className="max-w-4xl py-12 mx-auto">
    <div className="grid items-start gap-8" >
      <h1 className="font-bold text-3xl md:text-4xl" >
        Settings
      </h1>
    </div>

    <div className="grid gap-10 py-8" >
      <UserNameForm user={{ id: session?.user.id, username: session?.user.username || "" }} />
    </div>
  </div>;
};

page.displayName = "page";
export default page;
