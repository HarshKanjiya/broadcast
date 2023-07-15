import { getAuthSession } from "@/lib/AuthOptions";
import { db } from "@/lib/db";

export async function PUT(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) return new Response("unathorized", { status: 401 });
    const { postId, type } = await req.json();

    await db.notification.update({
      where: {
        userId_postId: {
          postId: postId,
          userId: session.user.id,
        },
      },
      data: {
        type: type,
      },
    });

    return new Response(JSON.stringify({ postId: postId }));
  } catch (err) {}
}
