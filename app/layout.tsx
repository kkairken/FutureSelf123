import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/Toaster";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });
const merriweather = Merriweather({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "700"],
  variable: "--font-merriweather"
});

export const metadata: Metadata = {
  title: "Future Self - Create Your Identity Through Story",
  description: "Transform your future into a powerful narrative. Generate personalized chapters where you become who you want to be.",
  keywords: "identity programming, personal development, future self, narrative psychology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body className="font-sans antialiased">
        <LanguageProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
