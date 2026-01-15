import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMagicLinkEmail(email: string, token: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const magicLink = `${appUrl}/auth/verify?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #ededed; }
          .container { max-width: 600px; margin: 40px auto; padding: 40px; background: #151515; border-radius: 12px; border: 1px solid #262626; }
          .logo { font-size: 24px; font-weight: bold; background: linear-gradient(to right, #a78bfa, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 20px; }
          .button { display: inline-block; padding: 16px 32px; background: #8b5cf6; color: white; text-decoration: none; border-radius: 8px; font-weight: 500; margin: 20px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #262626; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">Future Self</div>
          <h1 style="font-size: 28px; margin: 20px 0;">Your Magic Link</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #ccc;">Click the button below to sign in to your account. This link will expire in 15 minutes.</p>
          <a href="${magicLink}" class="button">Sign In to Future Self</a>
          <p style="font-size: 14px; color: #888;">Or copy this link: <br/><span style="color: #8b5cf6;">${magicLink}</span></p>
          <div class="footer">
            <p>If you didn't request this email, you can safely ignore it.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Sign in to Future Self",
    html,
  });
}
