import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Subscription from "@/models/Subscription";

// export async function GET() {
//   try {
//     await connectToDatabase();
//     const plans = await Subscription.find().sort({ pricePerMonth: 1 });
//     return NextResponse.json(plans);
//   } catch (error) {
//     console.error("Error fetching plans:", error);
//     return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
//   }
// }

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "true";

    let plans;

    if (isAdmin) {
      // Admin dashboard → show all plans
      plans = await Subscription.find().sort({ pricePerMonth: 1 });
    } else {
      // Public pages → show only enabled plans
      plans = await Subscription.find({ isDisabled: { $ne: true } })
        .sort({ pricePerMonth: 1 });
    }

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    // Ensure features is an array
    if (body.features && typeof body.features === 'string') {
        body.features = body.features.split(',').map((f: string) => f.trim());
    }

    const newPlan = await Subscription.create(body);
    return NextResponse.json(newPlan, { status: 201 });
  } catch (error) {
    console.error("Error creating plan:", error);
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { _id, ...updates } = body;

    const updatedPlan = await Subscription.findByIdAndUpdate(_id, updates, { new: true });
    return NextResponse.json(updatedPlan);
  } catch (error) {
    console.error("Error updating plan:", error);
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
  }
}