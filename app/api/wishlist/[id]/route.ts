import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth/jwt";
import Wishlist from "@/models/Wishlist";
import Comparision from "@/models/Comparision";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    const clientId = user.userId;
    const { id } = params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid wishlist ID" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const deletedWishlist = await Wishlist.findOneAndDelete({
      agencyId: new mongoose.Types.ObjectId(id),
      clientId,
    });

    if (!deletedWishlist) {
      return NextResponse.json(
        {
          success: false,
          message: "Wishlist item not found or unauthorized",
        },
        { status: 404 },
      );
    }
    await Comparision.findOneAndUpdate(
      {
        agencyId: new mongoose.Types.ObjectId(id),
        clientId,
      },
      {
        $set: {
          isFavourite: false, // example field
        },
      },
      {
        new: true, // returns updated document
      },
    );

    return NextResponse.json(
      {
        success: true,
        message: "Removed from wishlist successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Wishlist DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
