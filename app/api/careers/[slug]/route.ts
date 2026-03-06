import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Job from "@/models/Job"

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  await connectToDatabase()

  const job = await Job.findOne({
    slug: params.slug,
    isActive: true,
  })

  if (!job) {
    return NextResponse.json({ message: "Not found" }, { status: 404 })
  }

  return NextResponse.json(job)
}
