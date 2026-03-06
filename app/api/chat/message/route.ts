import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth/jwt";
import { Message } from "@/models/Message";
import { Conversation } from "@/models/Message";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const {
      conversationId,
      receiverId,
      content,
      messageType = "TEXT",
      attachments = [],
      senderType,
    } = await request.json();

    if (
      !mongoose.Types.ObjectId.isValid(conversationId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });
    }

    const message = await Message.create({
      conversationId,
      senderId: user.userId,
      senderType,
      receiverId,
      content,
      messageType,
      attachments,
    });

    // ✅ Update conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: content,
      lastMessageAt: new Date(),
      $inc: { [`unreadCount.${receiverId}`]: 1 },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
