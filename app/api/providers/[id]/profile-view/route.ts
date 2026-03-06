import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Provider from "@/models/Provider"
import Review from "@/models/Review"
import { getCurrentUser } from "@/lib/auth/jwt"
import mongoose from "mongoose"
import dayjs from "dayjs";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();

  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid provider ID" }, { status: 400 });
  }

  const provider = await Provider.findOne({
      $or: [
        { _id: id },         // match provider's _id
        { userId: id },      // match provider's userId
      ],
    })
  if (!provider) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 });
  }

  const monthKey = dayjs().format("YYYY-MM");

  if (provider.currentMonthKey !== monthKey) {
    provider.currentMonthKey = monthKey;
    provider.lastMonthProfileViews = provider.currentMonthProfileViews || 0;
    provider.currentMonthProfileViews = 0;
    provider.currentMonthWebsiteClicks = 0;
  }

  provider.profileViews += 1;
  provider.currentMonthProfileViews += 1;
  // provider.lastMonthProfileViews = provider.currentMonthProfileViews || 0;

  await provider.save();

  return NextResponse.json({ success: true });
}
