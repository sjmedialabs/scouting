import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Application from "@/models/Application"
import { sendApplicationStatusEmail } from "@/lib/mail"

export async function POST(req: NextRequest) {
  await connectToDatabase()

  const { id, status } = await req.json()

  const updated = await Application.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  )

  //  Send email after status update
  if (updated) {
    await sendApplicationStatusEmail(
      updated.email,
      updated.firstName,
      updated.jobTitle,
      status
    )
  }

  return NextResponse.json(updated)
}
