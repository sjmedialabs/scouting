import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Contact from "@/models/contact"

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const isValidPhone = (phone: string) =>
  /^[0-9]{10,15}$/.test(phone)

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase()

        const body = await req.json()
        const {name, email, company, website, country, phone } = body

        if (!name || !email || !company || !website || !country || !phone) {
            return NextResponse.json(
                {error: "All fields are requried"},
                {status:400}
            )
        }

        if (!isValidEmail(email)) {
            return NextResponse.json(
                { error: "Invalid email address" },
                { status: 400}
            )
        }

        if (!isValidPhone(phone)) {
            return NextResponse.json(
                { error: "Invalid phone number"},
                { status: 400 }
            ) 
        }

        await Contact.create({
            name,
            email,
            company,
            website,
            country,
            phone,
        })

        return NextResponse.json({ success: true})
    } catch (error) {
        console.error("Contact submission error:", error)
        return NextResponse.json(
            { error: "Failed to submit contact request" },
            { status: 500}
        )
    }
}