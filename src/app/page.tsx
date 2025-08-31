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
import StudyDashboard from "@/components/StudyDashboard";
import QuickAccessMenu from "@/components/QuickAccessMenu";
import AITutor from "@/components/AITutor";
import { AIProvider } from "@/components/AITutor";

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
  >("dashboard");
  const [userName, setUserName] = useState("Student");
  const [studyStreak, setStudyStreak] = useState(7);
  const [completedGoals, setCompletedGoals] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [aiQueryLimitReached, setAiQueryLimitReached] = useState(false); // Rate limiting state
  const isRTL = language === "arabic";

  const cycleLanguage = () => {
    const languages: ("english" | "arabic" | "hindi")[] = [
      "english",
      "arabic",
      "hindi",
    ];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
    // In a real app, this would trigger enabling/disabling push notifications
  };

  const handleGoalComplete = (goalId: string) => {
    setCompletedGoals((prev) => prev + 1);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const getLocalizedText = (key: string) => {
    const texts = {
      english: {
        appName: "Nukhba AI",
        tagline: "The Future of Competitive Exam Prep",
        dashboard: "Dashboard",
        aiTutor: "AI Tutor",
        quizzes: "Quizzes",
        flashcards: "Flashcards",
        analytics: "Analytics",
        switchLanguage: "Switch Language",
        toggleTheme: "Toggle Theme",
        toggleNotifications: "Toggle Notifications",
        notificationsOn: "Notifications On",
        notificationsOff: "Notifications Off",
        lightMode: "Switch to light mode",
        darkMode: "Switch to dark mode",
        copyright: "© 2025 Nukhba AI. All rights reserved.",
        welcomeBack: "Welcome back!",
        readyToLearn: "Ready to continue your learning journey?",
        goalCompleted: "Goal completed! Great job!",
        queryLimitReached:
          "AI query limit reached. Upgrade to premium for unlimited access.",
        errorFallback: "Something went wrong. Please try again later.",
      },
      arabic: {
        appName: "نخبة الذكي",
        tagline: "مستقبل التحضير للامتحانات التنافسية",
        dashboard: "لوحة التحكم",
        aiTutor: "المدرس الذكي",
        quizzes: "الاختبارات",
        flashcards: "البطاقات التعليمية",
        analytics: "التحليلات",
        switchLanguage: "تغيير اللغة",
        toggleTheme: "تغيير المظهر",
        toggleNotifications: "تبديل الإشعارات",
        notificationsOn: "الإشعارات مفعلة",
        notificationsOff: "الإشعارات معطلة",
        lightMode: "التبديل إلى الوضع الفاتح",
        darkMode: "التبديل إلى الوضع الداكن",
        copyright: "© 2025 نخبة الذكي. جميع الحقوق محفوظة.",
        welcomeBack: "مرحباً بعودتك!",
        readyToLearn: "هل أنت مستعد لمواصلة رحلة التعلم؟",
        goalCompleted: "تم إكمال الهدف! عمل رائع!",
        queryLimitReached:
          "تم الوصول إلى حد الاستفسارات. قم بالترقية للوصول غير المحدود.",
        errorFallback: "حدث خطأ. يرجى المحاولة لاحقاً.",
      },
      hindi: {
        appName: "नुख्बा AI",
        tagline: "प्रतियोगी परीक्षा तैयारी का भविष्य",
        dashboard: "डैशबोर्ड",
        aiTutor: "AI शिक्षक",
        quizzes: "प्रश्नोत्तरी",
        flashcards: "फ्लैशकार्ड",
        analytics: "विश्लेषण",
        switchLanguage: "भाषा बदलें",
        toggleTheme: "थीम टॉगल करें",
        toggleNotifications: "सूचनाएं टॉगल करें",
        notificationsOn: "सूचनाएं चालू",
        notificationsOff: "सूचनाएं बंद",
        lightMode: "लाइट मोड पर स्विच करें",
        darkMode: "डार्क मोड पर स्विच करें",
        copyright: "© 2025 नुख्बा AI. सभी अधिकार सुरक्षित।",
        welcomeBack: "वापसी पर स्वागत!",
        readyToLearn:
          "क्या आप अपनी सीखने की यात्रा जारी रखने के लिए तैयार हैं?",
        goalCompleted: "लक्ष्य पूरा हुआ! शानदार काम!",
        queryLimitReached:
          "AI क्वेरी सीमा पहुंच गई। असीमित पहुंच के लिए प्रीमियम में अपग्रेड करें।",
        errorFallback: "कुछ गलत हो गया। कृपया बाद में पुनः प्रयास करें।",
      },
    };
    return texts[language]?.[key] || texts.english[key];
  };

  // Load user preferences with validation
  useEffect(() => {
    const savedLanguage = localStorage.getItem("nukhba-language");
    const savedTheme = localStorage.getItem("nukhba-theme");
    const savedUserName = localStorage.getItem("nukhba-username");

    // Validate language
    const validLanguages = ["english", "arabic", "hindi"];
    if (savedLanguage && validLanguages.includes(savedLanguage)) {
      setLanguage(savedLanguage as "english" | "arabic" | "hindi");
    }

    // Validate theme
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      setTheme(savedTheme);
    }

    // Sanitize userName to prevent XSS
    if (savedUserName) {
      const sanitizedUserName = savedUserName.replace(/[<>"'&]/g, "");
      setUserName(sanitizedUserName || "Student");
    }
  }, [setTheme]);

  // Save user preferences
  useEffect(() => {
    localStorage.setItem("nukhba-language", language);
  }, [language]);

  useEffect(() => {
    if (theme && ["light", "dark", "system"].includes(theme)) {
      localStorage.setItem("nukhba-theme", theme);
    }
  }, [theme]);

  // Mock rate limiting check (in a real app, this would be an API call)
  useEffect(() => {
    const checkQueryLimit = () => {
      const queryCount = parseInt(
        localStorage.getItem("ai-query-count") || "0",
        10,
      );
      if (queryCount >= 10) {
        setAiQueryLimitReached(true);
      }
    };
    checkQueryLimit();
  }, []);

  return (
    <AIProvider>
      <main
        className={`flex min-h-screen flex-col items-center justify-between p-4 md:p-8 bg-background transition-all duration-300`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Celebration overlay */}
        {showCelebration && (
          <div
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
            role="alert"
            aria-live="polite"
            aria-label={getLocalizedText("goalCompleted")}
          >
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
        )}

        <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1>{getLocalizedText("appName")}</h1>
          </div>

          {/* Main content tabs */}
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
              {/* Study Dashboard */}
              <ErrorBoundary
                fallback={
                  <p className="text-red-500">
                    {getLocalizedText("errorFallback")}
                  </p>
                }
              >
                <StudyDashboard language={language} />
              </ErrorBoundary>

              {/* Quick Access Menu */}
              <ErrorBoundary
                fallback={
                  <p className="text-red-500">
                    {getLocalizedText("errorFallback")}
                  </p>
                }
              >
                <QuickAccessMenu
                  language={language}
                  onTutorClick={() => setActiveTab("tutor")}
                />
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="tutor">
              {aiQueryLimitReached ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-red-500">
                      {getLocalizedText("queryLimitReached")}
                    </p>
                    <Button
                      onClick={() => {
                        // In a real app, this would redirect to a subscription page
                        console.log("Redirect to premium subscription");
                      }}
                      className="mt-4"
                    >
                      Upgrade to Premium
                    </Button>
                  </CardContent>
                </Card>
              ) : (
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
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <footer className="w-full max-w-7xl mx-auto mt-8 text-center text-sm text-muted-foreground">
          <p>{getLocalizedText("copyright")}</p>
        </footer>
      </main>
    </AIProvider>
  );
}
