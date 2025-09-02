"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent } from "@/components/ui/card";
import AITutor from "@/components/AITutor";

// A simple error boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState<"english" | "arabic" | "hindi">(
    "english",
  );
  const isRTL = language === "arabic";

  const getLocalizedText = (key: string) => {
    const texts: Record<string, string> = {
      appName: "Nukhba AI",
      copyright: "© 2025 Nukhba AI. All rights reserved.",
      errorFallback: "Something went wrong. Please try again later.",
    };
    return texts[key] || "";
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-4 md:p-8 bg-background`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{getLocalizedText("appName")}</h1>
        </header>

        {/* The main AI Tutor component is the only active feature now */}
        <ErrorBoundary
          fallback={
            <p className="text-red-500">
              {getLocalizedText("errorFallback")}
            </p>
          }
        >
          <AITutor
            language={language}
            onLanguageChange={setLanguage}
          />
        </ErrorBoundary>

        {/* All other components are offloaded. You can add them back one by one later */}
      </div>

      <footer className="w-full max-w-7xl mx-auto mt-8 text-center text-sm text-muted-foreground">
        <p>{getLocalizedText("copyright")}</p>
      </footer>
    </main>
  );
}
