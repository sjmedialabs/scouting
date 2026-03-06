import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { email, message } = await req.json();

    if (!email || !message) {
      return NextResponse.json(
        { error: "Email and message are required" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlTemplate = `
      <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; padding: 40px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <div style="background-color: #0f172a; padding: 20px 24px;">
            <h2 style="color: #ffffff; margin: 0;">Scout</h2>
            <p style="color: #cbd5e1; margin: 4px 0 0;">Message from Super Admin</p>
          </div>

          <!-- Body -->
          <div style="padding: 24px; color: #334155;">
            <p style="font-size: 16px; margin-bottom: 16px;">
              Hello,
            </p>

            <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
              You have received the following message from the Scout Super Admin:
            </p>

            <div style="background-color: #f1f5f9; border-left: 4px solid #2563eb; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
              <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #1e293b;">
                ${message}
              </p>
            </div>

            <p style="font-size: 14px; color: #64748b;">
              If you have any questions or need further assistance, feel free to reply to this email.
            </p>

            <p style="font-size: 14px; margin-top: 24px;">
              Best regards,<br/>
              <strong>Scout Team</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8;">
            © ${new Date().getFullYear()} Scout. All rights reserved.
          </div>

        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Scout Super Admin" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Message from Scout Super Admin",
      text: message, // fallback for non-HTML clients
      html: htmlTemplate,
    });

    return NextResponse.json(
      { success: true, message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Mail error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
