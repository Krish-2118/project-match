import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createAblyTokenRequest, isAblyConfigured } from "@/lib/ably";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!isAblyConfigured()) {
    return new NextResponse("Realtime messaging is not configured", {
      status: 503,
    });
  }

  try {
    const tokenRequest = await createAblyTokenRequest(session.user.id);
    return NextResponse.json(tokenRequest);
  } catch (error) {
    console.error("[ABLY_TOKEN_GET]", error);
    return new NextResponse("Failed to create realtime token", {
      status: 500,
    });
  }
}
