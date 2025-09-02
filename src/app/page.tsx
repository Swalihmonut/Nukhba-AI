"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  MoonIcon,
  SunIcon,
  Globe,
  Sparkles,
  Trophy,
  Target,
  Bell,
} from "lucide-react";

// We are temporarily commenting out the components with errors
// import StudyDashboard from "@/components/StudyDashboard";
// import QuickAccessMenu from "@/components/QuickAccessMenu";
import AITutor from "@/components/AITutor";
// import { AIProvider } from "@/components/AITutor"; // Assuming AIProvider is in AITutor

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState<"english" | "arabic" | "hindi">(
    "english",
  );
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "tutor" | "quiz" | "flashcards" | "analytics"
  >("tutor"); // Default to tutor for now
  const isRTL = language === "arabic";

  const getLocalizedText = (key: string) => {
    const texts: Record<
      "english" | "arabic" | "hindi",
      Record<string, string>
    > = {
      english: {
        appName: "Nukhba AI",
        tagline: "The Future of Competitive Exam Prep",
        dashboard: "Dashboard",
        aiTutor: "AI Tutor",
        copyright: "© 2025 Nukhba AI. All rights reserved.",
        errorFallback: "Something went wrong. Please try again later.",
      },
      arabic: {
        appName: "نخبة الذكي",
        tagline: "مستقبل التحضير للامتحانات التنافسية",
        dashboard: "لوحة التحكم",
        aiTutor: "المدرس الذكي",
        copyright: "© 2025 نخبة الذكي. جميع الحقوق محفوظة.",
        errorFallback: "حدث خطأ. يرجى المحاولة لاحقاً.",
      },
      hindi: {
        appName: "नुख्बा AI",
        tagline: "प्रतियोगी परीक्षा तैयारी का भविष्य",
        dashboard: "डैशबोर्ड",
        aiTutor: "AI शिक्षक",
        copyright: "© 2025 नुख्बा AI. सभी अधिकार सुरक्षित।",
        errorFallback: "कुछ गलत हो गया। कृपया बाद में पुनः प्रयास करें।",
      },
    };
    return texts[language]?.[key] || texts.english[key];
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-4 md:p-8 bg-background transition-all duration-300`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1>{getLocalizedText("appName")}</h1>
        </div>

        {/* Simplified main content */}
        <Card>
          <CardContent className="p-0">
            <ErrorBoundary
              fallback={
                <p className="text-red-500">
                  {getLocalizedText("errorFallback")}
                </p>
              }
            >
              <AITutor language={language} />
            </ErrorBoundary>
          </CardContent>
        </Card>

        {/*
          // You can uncomment these sections later, one by one, to debug them.
          <Tabs
            defaultValue="dashboard"
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(
                value as
                  | "dashboard"
                  | "tutor"
                  | "quiz"
                  | "flashcards"
                  | "analytics",
              )
            }
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
              <StudyDashboard language={language} />
              <QuickAccessMenu
                language={language}
                onTutorClick={() => setActiveTab("tutor")}
              />
            </TabsContent>

            <TabsContent value="tutor">
              <Card>
                <CardContent className="p-0">
                  <AITutor language={language} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        */}
      </div>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto mt-8 text-center text-sm text-muted-foreground">
        <p>{getLocalizedText("copyright")}</p>
      </footer>
    </main>
  );
}
