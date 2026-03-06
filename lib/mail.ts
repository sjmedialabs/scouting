import nodemailer from "nodemailer";

export async function sendSetPasswordEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const link = `${process.env.NEXT_PUBLIC_APP_URL}/set-password?token=${token}`;

  await transporter.sendMail({
    from: `"Your App" <no-reply@yourapp.com>`,
    to: email,
    subject: "Set your password",
    html: `
      <p>You have been added as an agency.</p>
      <p>Click below to set your password:</p>
      <a href="${link}">Set Password</a>
    `,
  });
}

export async function sendApplicationStatusEmail(
  email: string,
  name: string,
  jobTitle: string,
  status: "accepted" | "rejected"
) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const subject =
    status === "accepted"
      ? "Application Update — Selected"
      : "Application Update"

  const html =
    status === "accepted"
      ? `
        <p>Hi ${name},</p>
        <p>We’re happy to inform you that your application for <b>${jobTitle}</b> has been <b>accepted</b>.</p>
        <p>Our team will contact you soon with next steps.</p>
      `
      : `
        <p>Hi ${name},</p>
        <p>Thank you for applying for <b>${jobTitle}</b>.</p>
        <p>After careful review, we will not be moving forward with your application.</p>
        <p>We appreciate your interest in our company.</p>
      `

  await transporter.sendMail({
    from: `"Careers Team" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    html,
  });
}

