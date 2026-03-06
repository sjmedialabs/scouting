import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { getCurrentUser } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const {
      userId, // receiver
      title,
      message,
      type,
      userRole,
      linkUrl,
      sourceId,
    } = body;

    // ✅ Required fields validation
    if (!userId || !title || !message || !type) {
      return NextResponse.json(
        {
          success: false,
          message: "userId, title, message, type, and userRole are required",
        },
        { status: 400 },
      );
    }

    // ✅ Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      (sourceId && !mongoose.Types.ObjectId.isValid(sourceId))
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid ObjectId provided" },
        { status: 400 },
      );
    }

    // ✅ Create notification
    const notification = await Notification.create({
      userId,
      triggeredBy: user.userId, // logged-in user who triggered event
      title,
      message,
      type,
      userRole,
      linkUrl,
      sourceId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Notification created successfully",
        data: {
          _id: notification._id,
          userId: notification.userId,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          userRole: notification.userRole,
          linkUrl: notification.linkUrl,
          isRead: notification.isRead,
          createdAt: notification.createdAt,
          updatedAt: notification.updatedAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Notification POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // 🔐 Auth check
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    const userId = new mongoose.Types.ObjectId(user.userId);

    await connectToDatabase();

    const notifications = await Notification.aggregate([
      {
        // 1️⃣ Fetch notifications for logged-in user
        $match: {
          userId,
        },
      },

      // 2️⃣ Join triggered user
      {
        $lookup: {
          from: "users",
          localField: "triggeredBy",
          foreignField: "_id",
          as: "triggeredUser",
        },
      },
      {
        $unwind: {
          path: "$triggeredUser",
          preserveNullAndEmptyArrays: true,
        },
      },

      // 3️⃣ Lookup Seeker (CLIENT)
      {
        $lookup: {
          from: "seekers",
          localField: "triggeredBy",
          foreignField: "userId",
          as: "seeker",
        },
      },

      // 4️⃣ Lookup Provider (AGENCY)
      {
        $lookup: {
          from: "providers",
          localField: "triggeredBy",
          foreignField: "userId",
          as: "provider",
        },
      },

      // 5️⃣ Decide image based on role
      {
        $addFields: {
          image: {
            $cond: [
              { $eq: ["$triggeredUser.role", "client"] },
              { $arrayElemAt: ["$seeker.image", 0] },
              {
                $cond: [
                  { $eq: ["$triggeredUser.role", "agency"] },
                  { $arrayElemAt: ["$provider.logo", 0] },
                  null,
                ],
              },
            ],
          },
        },
      },

      // 6️⃣ Shape final response
      {
        $project: {
          _id: 1,
          title: 1,
          message: 1,
          type: 1,
          linkUrl: 1,
          isRead: 1,
          createdAt: 1,
          userRole: 1,
          sourceId: 1,
          image: 1,
          triggeredBy: {
            _id: "$triggeredUser._id",
            name: "$triggeredUser.name",
            role: "$triggeredUser.role",
          },
        },
      },

      // 7️⃣ Latest first
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return NextResponse.json(
      {
        success: true,
        data: notifications,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Notification GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
