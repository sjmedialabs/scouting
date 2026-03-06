import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Job from "@/models/Job"
import slugify from "slugify"

export async function POST(req: NextRequest) {
  await connectToDatabase()
  const body = await req.json()

  const slug = slugify(body.title, { lower: true, strict: true })

  const job = await Job.create({
    ...body,
    slug,
  })

  return NextResponse.json(job, { status: 201 })
}
