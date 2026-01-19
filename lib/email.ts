/**
 * Send magic link email via Resend
 * Resend: https://resend.com - Modern transactional email service
 *
 * Setup:
 * 1. Sign up at https://resend.com
 * 2. Get API key from Dashboard → API Keys
 * 3. Add to .env: RESEND_API_KEY=re_...
 * 4. (Optional) Add domain for production emails
 */

export async function sendMagicLinkEmail(
  email: string,
  token: string,
  locale: "en" | "ru" | "kz" = "en"
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const magicLink = `${appUrl}/auth/verify?token=${token}`;

  // Определяем язык из email или используем английский по умолчанию
  const contentByLocale = {
    en: {
      subject: "Sign in to Future Self",
      heading: "Your Magic Link",
      text: "Click the button below to sign in to your account. This link will expire in 15 minutes.",
      button: "Sign In to Future Self",
      linkText: "Or copy this link:",
      footer: "If you didn't request this email, you can safely ignore it.",
    },
    ru: {
      subject: "Вход в Future Self",
      heading: "Ваша ссылка для входа",
      text: "Нажмите кнопку ниже, чтобы войти в аккаунт. Ссылка действует 15 минут.",
      button: "Войти в Future Self",
      linkText: "Или скопируйте ссылку:",
      footer: "Если вы не запрашивали письмо, просто проигнорируйте его.",
    },
    kz: {
      subject: "Future Self жүйесіне кіру",
      heading: "Кіру сілтемесі",
      text: "Кіру үшін төмендегі батырманы басыңыз. Сілтеме 15 минутқа жарамды.",
      button: "Future Self жүйесіне кіру",
      linkText: "Немесе осы сілтемені көшіріңіз:",
      footer: "Егер бұл хатты сіз сұрамаған болсаңыз, оны елемей-ақ қойыңыз.",
    },
  };

  const content = contentByLocale[locale] || contentByLocale.en;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #0a0a0a;
            color: #ededed;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            padding: 40px;
            background: #151515;
            border-radius: 12px;
            border: 1px solid #262626;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            background: linear-gradient(to right, #a78bfa, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 20px;
          }
          h1 {
            font-size: 28px;
            margin: 20px 0;
            color: #ededed;
          }
          p {
            font-size: 16px;
            line-height: 1.6;
            color: #ccc;
          }
          .button {
            display: inline-block;
            padding: 16px 32px;
            background: #8b5cf6;
            color: white !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
            margin: 20px 0;
          }
          .link {
            color: #8b5cf6;
            word-break: break-all;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #262626;
            font-size: 14px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">Future Self</div>
          <h1>${content.heading}</h1>
          <p>${content.text}</p>
          <a href="${magicLink}" class="button">${content.button}</a>
          <p style="font-size: 14px; color: #888;">
            ${content.linkText}<br/>
            <span class="link">${magicLink}</span>
          </p>
          <div class="footer">
            <p>${content.footer}</p>
          </div>
        </div>
      </body>
    </html>
  `;

  // Development mode: just log the link
  if (!process.env.RESEND_API_KEY) {
    console.log("\n========================================");
    console.log("📧 EMAIL (Resend not configured)");
    console.log("========================================");
    console.log("To:", email);
    console.log("Subject:", content.subject);
    console.log("Magic Link:", magicLink);
    console.log("========================================\n");
    console.log("💡 To enable email sending:");
    console.log("1. Sign up at https://resend.com");
    console.log("2. Get API key from Dashboard → API Keys");
    console.log("3. Add to .env: RESEND_API_KEY=re_...");
    console.log("4. (Optional) Add your domain in Resend Dashboard");
    console.log("========================================\n");
    return;
  }

  // Production mode: send via Resend
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "Future Self <onboarding@resend.dev>",
        to: [email],
        subject: content.subject,
        html: html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Resend API error:", error);
      throw new Error(`Failed to send email: ${response.status} ${error}`);
    }

    const data = await response.json();
    console.log("✅ Email sent via Resend:", data.id);

  } catch (error) {
    console.error("Error sending email via Resend:", error);
    // Log the link as fallback
    console.log("🔗 Fallback magic link:", magicLink);
    throw error;
  }
}
