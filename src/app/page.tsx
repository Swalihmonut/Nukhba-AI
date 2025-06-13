"use client";

import { useState, useEffect } from "react";
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

// Assume AIProvider exists for AITutor (from previous context)
import { AIProvider } from "@/components/AITutor";

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
    // Simulate checking AI query limit for free tier
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
        dir={isRTL ? "rtl" : "ltr"} // Use dir attribute for proper RTL support
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
            <div className="absolute top-1/4 left-1/4 text-4xl confetti">
              ⭐
            </div>
            <div
              className="absolute top-1/3 right-1/4 text-4xl confetti"
              style={{ animationDelay: "0.5s" }}
            >
              🏆
            </div>
            <div
              className="absolute bottom-1/3 left-1/3 text-4xl confetti"
              style={{ animationDelay: "1s" }}
            >
              ✨
            </div>
          </div>
        )}

        <div className="w-full max-w-7xl mx-auto">
          {/* Header with app name and controls */}
          <div className="flex justify-between items-center mb-6 slide-up">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {getLocalizedText("appName")}
                  </h1>
                  <p className="text-sm text-muted-foreground hidden md:block">
                    {getLocalizedText("tagline")}
                  </p>
                </div>
              </div>
              {studyStreak > 0 && (
                <Badge
                  variant="outline"
                  className="hidden md:flex items-center gap-1 bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30"
                >
                  <Trophy className="h-3 w-3" />
                  <span>{studyStreak} day streak!</span>
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={cycleLanguage}
                aria-label={getLocalizedText("switchLanguage")}
                className="hover:scale-105 transition-transform"
              >
                <Globe className="h-4 w-4" />
                <span className="sr-only">
                  {getLocalizedText("switchLanguage")}
                </span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label={getLocalizedText("toggleTheme")}
                className="hover:scale-105 transition-transform"
              >
                {theme === "dark" ? (
                  <SunIcon className="h-4 w-4" />
                ) : (
                  <MoonIcon className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {theme === "dark"
                    ? getLocalizedText("lightMode")
                    : getLocalizedText("darkMode")}
                </span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleNotifications}
                aria-label={getLocalizedText("toggleNotifications")}
                className="hover:scale-105 transition-transform"
              >
                <Bell className="h-4 w-4" />
                <span className="sr-only">
                  {notificationsEnabled
                    ? getLocalizedText("notificationsOff")
                    : getLocalizedText("notificationsOn")}
                </span>
              </Button>
            </div>
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
