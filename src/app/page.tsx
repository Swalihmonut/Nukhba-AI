"use client";

import React, { useState } from "react";
import AITutor from "@/components/AITutor";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";

// A simple error boundary to catch any unexpected errors in child components
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

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-4 md:p-8 bg-background`}
    >
      <div className="w-full max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Nukhba AI</h1>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </header>

        {/* The main AI Tutor component is the only active feature now */}
        <ErrorBoundary fallback={<p className="text-red-500">Error loading AI Tutor.</p>}>
          <AITutor
            language={language}
            onLanguageChange={setLanguage}
          />
        </ErrorBoundary>

        {/* You can add back your other components here later, one by one */}
      </div>

      <footer className="w-full max-w-7xl mx-auto mt-8 text-center text-sm text-muted-foreground">
        <p>© 2025 Nukhba AI. All rights reserved.</p>
      </footer>
    </main>
  );
}
