import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import {
  ChatError,
  getOrCreateConversation,
  listConversationSummaries,
} from "@/lib/chat";

const createConversationSchema = z.object({
  otherUserId: z.string().min(1),
});

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const conversations = await listConversationSummaries(session.user.id);
    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("[MESSAGES_CONVERSATIONS_GET]", error);
    return new NextResponse("Failed to load conversations", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = createConversationSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse(validation.error.issues[0].message, {
        status: 400,
      });
    }

    const conversation = await getOrCreateConversation(
      session.user.id,
      validation.data.otherUserId,
    );

    return NextResponse.json({ conversation });
  } catch (error) {
    if (error instanceof ChatError) {
      return new NextResponse(error.message, { status: error.status });
    }

    console.error("[MESSAGES_CONVERSATIONS_POST]", error);
    return new NextResponse("Failed to start conversation", { status: 500 });
  }
}
