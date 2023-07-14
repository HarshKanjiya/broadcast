import { getAuthSession } from "@/lib/AuthOptions";
import { db } from "@/lib/db";
import { UserNameValidator } from "@/lib/validators/UserName";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) return new Response("Unauthorized!", { status: 401 });

    const { name } = UserNameValidator.parse(await req.json());

    const username = await db.user.findFirst({
      where: {
        username: name,
      },
    });
    if (username) return new Response("usernmae is taken", { status: 409 });

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username: name,
      },
    });
    return new Response("OK", { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }
    return new Response("Could not Update your Username", {
      status: 500,
    });
  }
}
