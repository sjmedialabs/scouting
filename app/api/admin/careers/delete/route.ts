import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Job from "@/models/Job"

export async function POST(req: NextRequest) {
  await connectToDatabase()

  const { id } = await req.json()

  await Job.findByIdAndDelete(id)

  return NextResponse.json({ success: true })
}
