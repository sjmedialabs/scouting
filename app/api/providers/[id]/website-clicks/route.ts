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

  const provider = await Provider.findOne({
      $or: [
        { _id: id },         // match provider's _id
        { userId: id },      // match provider's userId
      ],
    })
  if (!provider) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const monthKey = dayjs().format("YYYY-MM");

  if (provider.currentMonthKey !== monthKey) {
    provider.currentMonthKey = monthKey;
    provider.currentMonthProfileViews = 0;
    provider.currentMonthWebsiteClicks = 0;
  }

  provider.websiteClicks += 1;
  provider.currentMonthWebsiteClicks += 1;

  await provider.save();

  return NextResponse.json({ success: true });
}
