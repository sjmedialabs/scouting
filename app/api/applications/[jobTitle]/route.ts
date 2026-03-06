import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Application from "@/models/Application"

export async function GET(
  req: NextRequest,
  { params }: { params: { jobTitle: string } }
) {
  try {
    await connectToDatabase()

    const jobTitle = decodeURIComponent(params.jobTitle)

    const apps = await Application.find({ jobTitle })

    return NextResponse.json(apps)
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch applications" },
      { status: 500 }
    )
  }
}
