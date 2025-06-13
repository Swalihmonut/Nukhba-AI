"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoonIcon, SunIcon, Globe } from "lucide-react";
import StudyDashboard from "@/components/StudyDashboard";
import QuickAccessMenu from "@/components/QuickAccessMenu";
import AITutor from "@/components/AITutor";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState<"english" | "arabic">("english");
  const [activeTab, setActiveTab] = useState<"dashboard" | "tutor">(
    "dashboard",
  );

  const toggleLanguage = () => {
    setLanguage(language === "english" ? "arabic" : "english");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 bg-background">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header with app name and controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">Nukhba AI</h1>
            <p className="ml-2 text-sm text-muted-foreground hidden md:block">
              The Future of Competitive Exam Prep
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleLanguage}
              aria-label="Toggle language"
            >
              <Globe className="h-4 w-4" />
              <span className="sr-only">
                {language === "english"
                  ? "Switch to Arabic"
                  : "Switch to English"}
              </span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <SunIcon className="h-4 w-4" />
              ) : (
                <MoonIcon className="h-4 w-4" />
              )}
              <span className="sr-only">
                {theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"}
              </span>
            </Button>
          </div>
        </div>

        {/* Main content tabs */}
        <Tabs
          defaultValue="dashboard"
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "dashboard" | "tutor")
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="tutor">AI Tutor</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Study Dashboard */}
            <StudyDashboard language={language} />

            {/* Quick Access Menu */}
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
      </div>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto mt-8 text-center text-sm text-muted-foreground">
        <p>© 2023 Nukhba AI. All rights reserved.</p>
      </footer>
    </main>
  );
}
