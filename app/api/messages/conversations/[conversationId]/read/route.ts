import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ChatError, markConversationRead } from "@/lib/chat";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { conversationId } = await params;
    await markConversationRead(session.user.id, conversationId);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ChatError) {
      return new NextResponse(error.message, { status: error.status });
    }

    console.error("[MESSAGES_CONVERSATION_READ_POST]", error);
    return new NextResponse("Failed to mark conversation as read", {
      status: 500,
    });
  }
}
