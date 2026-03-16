import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { publishMessageCreated } from "@/lib/ably";
import {
  ChatError,
  listMessagesForConversation,
  sendMessageToConversation,
} from "@/lib/chat";

const createMessageSchema = z.object({
  body: z.string(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { conversationId } = await params;
    const messages = await listMessagesForConversation(
      session.user.id,
      conversationId,
    );

    return NextResponse.json({ messages });
  } catch (error) {
    if (error instanceof ChatError) {
      return new NextResponse(error.message, { status: error.status });
    }

    console.error("[MESSAGES_CONVERSATION_MESSAGES_GET]", error);
    return new NextResponse("Failed to load messages", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = createMessageSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse(validation.error.issues[0].message, {
        status: 400,
      });
    }

    const { conversationId } = await params;
    const result = await sendMessageToConversation(
      session.user.id,
      conversationId,
      validation.data.body,
    );

    await publishMessageCreated(result.message, result.participantIds);

    return NextResponse.json({ message: result.message });
  } catch (error) {
    if (error instanceof ChatError) {
      return new NextResponse(error.message, { status: error.status });
    }

    console.error("[MESSAGES_CONVERSATION_MESSAGES_POST]", error);
    return new NextResponse("Failed to send message", { status: 500 });
  }
}
