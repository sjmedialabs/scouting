import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Job from "@/models/Job"

export async function POST(req: NextRequest) {
  await connectToDatabase()

  const { id, data } = await req.json()

  const job = await Job.findByIdAndUpdate(id, data, {
    new: true,
  })

  return NextResponse.json(job)
}
