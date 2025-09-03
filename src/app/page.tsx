"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoonIcon, SunIcon, Sparkles } from "lucide-react";
import StudyDashboard from "@/components/StudyDashboard";
import QuickAccessMenu from "@/components/QuickAccessMenu";
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

// Define a simple AI context
const AIContext = React.createContext({});
const AIProvider = ({ children }: { children: React.ReactNode }) => (
  <AIContext.Provider value={{}}>{children}</AIContext.Provider>
);

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState<"english" | "arabic">("english");
  const [activeTab, setActiveTab] = useState("dashboard");
  const isRTL = language === "arabic";

  const getLocalizedText = (key: string) => {
    const texts: Record<"english" | "arabic", Record<string, string>> = {
      english: {
        appName: "Nukhba AI",
        dashboard: "Dashboard",
        aiTutor: "AI Tutor",
        copyright: "© 2025 Nukhba AI. All rights reserved.",
        errorFallback: "Something went wrong loading this component.",
      },
      arabic: {
        appName: "نخبة الذكي",
        dashboard: "لوحة التحكم",
        aiTutor: "المدرس الذكي",
        copyright: "© 2025 نخبة الذكي. جميع الحقوق محفوظة.",
        errorFallback: "حدث خطأ أثناء تحميل هذا المكون.",
      },
    };
    return texts[language]?.[key] || texts.english[key];
  };

  return (
    <AIProvider>
      <main
        className={`flex min-h-screen flex-col items-center p-4 md:p-8 bg-background`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="w-full max-w-7xl mx-auto">
          <header className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">{getLocalizedText("appName")}</h1>
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

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="dashboard">
                {getLocalizedText("dashboard")}
              </TabsTrigger>
              <TabsTrigger value="tutor">
                {getLocalizedText("aiTutor")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <ErrorBoundary fallback={<p className="text-red-500">{getLocalizedText("errorFallback")}</p>}>
                <StudyDashboard language={language} />
              </ErrorBoundary>
              <ErrorBoundary fallback={<p className="text-red-500">{getLocalizedText("errorFallback")}</p>}>
                <QuickAccessMenu
                  language={language}
                  onTutorClick={() => setActiveTab("tutor")}
                />
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="tutor">
              <ErrorBoundary fallback={<p className="text-red-500">{getLocalizedText("errorFallback")}</p>}>
                <AITutor
                  language={language}
                  onLanguageChange={setLanguage}
                />
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </div>

        <footer className="w-full max-w-7xl mx-auto mt-8 text-center text-sm text-muted-foreground">
          <p>{getLocalizedText("copyright")}</p>
        </footer>
      </main>
    </AIProvider>
  );
}
