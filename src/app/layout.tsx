import { TempoInit } from "@/components/tempo-init";
import { ThemeProvider } from "next-themes";
import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "Nukhba AI",
  description: "The Future of Competitive Exam Prep",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="https://api.tempo.new/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body>
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
