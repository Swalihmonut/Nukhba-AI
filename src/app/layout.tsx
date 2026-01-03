import { TempoInit } from "@/components/tempo-init";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
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
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <TempoInit />
        </ThemeProvider>
      </body>
    </html>
  );
}
