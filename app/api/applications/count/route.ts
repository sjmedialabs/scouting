import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Application from "@/models/Application"

export async function GET() {
  await connectToDatabase()

  const counts = await Application.aggregate([
    {
      $group: {
        _id: "$jobTitle",
        count: { $sum: 1 },
      },
    },
  ])

  return NextResponse.json(counts)
}
