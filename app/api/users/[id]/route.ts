import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Provider from "@/models/Provider";
import { getCurrentUser } from "@/lib/auth/jwt";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Users can only view their own profile unless admin
    if (user.userId !== id && user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

      const userData = await User.findById(id)
          .select("-password")
          .populate("subscriptionPlanId")
          .lean()

        let subscription

        if (userData.subscriptionPlanId) {
          const plan = userData.subscriptionPlanId as any
          const isYearly = userData.billingCycle === "Yearly"

          subscription = {
            type: "paid",
            title: plan.title,
            price: isYearly ? plan.pricePerYear : plan.pricePerMonth,
            billingCycle: userData.billingCycle,
            features: plan.features,
            status:
              userData.subscriptionEndDate &&
              userData.subscriptionEndDate < new Date()
                ? "expired"
                : "active",
            startDate: userData.subscriptionStartDate,
            endDate: userData.subscriptionEndDate,
          }
        } else {
          // FREE TRIAL USERS
          subscription = {
            type: "trial",
            title: "Free Trial",
            price: 0,
            billingCycle: "Monthly",
            features: [],
            status: "trial",
            startDate: userData.createdAt,
            endDate: null,
          }
        }

        return NextResponse.json({
          user: {
            id: userData._id.toString(),
            email: userData.email,
            name: userData.name,
            role: userData.role,
            company: userData.company,
            phone: userData.phone,
            avatar: userData.avatar,
            isVerified: userData.isVerified,
            isActive: userData.isActive,
            subscriptionStartDate:userData?.subscriptionStartDate,
            subscriptionEndDate:userData?.subscriptionEndDate,
            proposalCount:userData?.proposalCount || 0,
            lastLogin: userData.lastLogin,
            createdAt: userData.createdAt,

          },
          subscription,
        })
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Users can only update their own profile unless admin
    if (user.userId !== id && user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();
    const allowedUpdates = ["name", "company", "phone", "avatar"];
    const updates: any = {};

    for (const key of allowedUpdates) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    // Admin-only updates
    if (user.role === "admin") {
      if (body.isVerified !== undefined) updates.isVerified = body.isVerified;
      if (body.isActive !== undefined) updates.isActive = body.isActive;
      if (body.role !== undefined) updates.role = body.role;
    }

    const updated = await User.findByIdAndUpdate(id, updates, {
      new: true,
    }).select("-password");

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updated._id.toString(),
        email: updated.email,
        name: updated.name,
        role: updated.role,
        company: updated.company,
        phone: updated.phone,
        avatar: updated.avatar,
        isVerified: updated.isVerified,
        isActive: updated.isActive,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Soft delete - just deactivate
    const updated = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Also deactivate provider profile if exists
    await Provider.findOneAndUpdate({ userId: id }, { isActive: false });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
