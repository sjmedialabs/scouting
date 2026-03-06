import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { getCurrentUser } from "@/lib/auth/jwt";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // 🔐 Auth check
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const notificationId = params.id;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return NextResponse.json(
        { success: false, message: "Invalid notification ID" },
        { status: 400 },
      );
    }

    // 🔒 Update only if notification belongs to logged-in user
    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        userId: user.userId, // ownership check
      },
      {
        $set: { isRead: true },
      },
      {
        new: true,
      },
    );

    if (!notification) {
      return NextResponse.json(
        {
          success: false,
          message: "Notification not found or access denied",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Notification marked as read",
        data: {
          id: notification._id,
          isRead: notification.isRead,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Notification PUT Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
