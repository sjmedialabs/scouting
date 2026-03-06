import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Application from "@/models/Application"

export async function POST(req: NextRequest) {
  await connectToDatabase()
  const body = await req.json()

  const app = await Application.create(body)

  return NextResponse.json(app)
}
