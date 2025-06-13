import { TempoInit } from "@/components/tempo-init";
import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const notoSansArabic = Noto_Sans_Arabic({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "Nukhba AI - The Future of Competitive Exam Prep",
  description:
    "AI-powered exam preparation app for Arabic-speaking and general students in India",
  keywords: [
    "exam prep",
    "AI tutor",
    "UGC-NET",
    "PSC",
    "Arabic",
    "competitive exams",
  ],
  authors: [{ name: "Nukhba AI Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="https://api.tempo.new/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body className={`${inter.className} ${notoSansArabic.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <TempoInit />
        </ThemeProvider>
      </body>
    </html>
  );
}
