import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Message } from "@/models/Message";
import { Conversation } from "@/models/Message";
import { getCurrentUser } from "@/lib/auth/jwt";

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();

    const { conversationId } = await request.json();

    await Message.updateMany(
      { conversationId, receiverId: user.userId, isRead: false },
      { isRead: true, readAt: new Date() },
    );

    await Conversation.findByIdAndUpdate(conversationId, {
      $set: { [`unreadCount.${user.userId}`]: 0 },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to mark as read" },
      { status: 500 },
    );
  }
}
