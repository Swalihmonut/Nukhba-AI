"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Book,
  Brain,
  BookOpen,
  Lightbulb,
  MessageSquare,
  Settings,
  BarChart3,
} from "lucide-react";
import { useTheme } from "next-themes";

interface QuickAccessItemProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick?: () => void;
  gradient?: string;
}

const QuickAccessItem = ({
  icon,
  label,
  description,
  onClick = () => {},
  gradient = "from-primary/10 to-primary/5",
}: QuickAccessItemProps) => {
  return (
    <Card
      className="bg-card hover:bg-accent/50 hover:scale-105 transition-all duration-300 cursor-pointer h-full shadow-sm hover:shadow-md"
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
        <div
          className={`rounded-full bg-gradient-to-br ${gradient} p-3 mb-3 hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        <h3 className="font-medium text-lg mb-1">{label}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

interface QuickAccessMenuProps {
  language?: "english" | "arabic" | "hindi";
  onTutorClick?: () => void;
  onQuizClick?: () => void;
  onFlashcardsClick?: () => void;
  onMaterialsClick?: () => void;
  onTestsClick?: () => void;
  onAnalyticsClick?: () => void;
  onSettingsClick?: () => void;
}

const QuickAccessMenu = ({
  language = "english",
  onTutorClick = () => {},
  onQuizClick = () => {},
  onFlashcardsClick = () => {},
  onMaterialsClick = () => {},
  onTestsClick = () => {},
  onAnalyticsClick = () => {},
  onSettingsClick = () => {},
}: QuickAccessMenuProps) => {
  const { theme } = useTheme();
  const isRTL = language === "arabic";

  const getLocalizedText = (key: string): string => {
    type TextKey =
      | "quickAccess"
      | "aiTutor"
      | "aiTutorDesc"
      | "quizzes"
      | "quizzesDesc"
      | "flashcards"
      | "flashcardsDesc"
      | "materials"
      | "materialsDesc"
      | "tests"
      | "testsDesc"
      | "analytics"
      | "analyticsDesc"
      | "settings"
      | "settingsDesc";
    const texts: Record<
      "english" | "arabic" | "hindi",
      Record<TextKey, string>
    > = {
      english: {
        quickAccess: "Quick Access",
        aiTutor: "AI Tutor",
        aiTutorDesc: "Get personalized help with your studies",
        quizzes: "Quizzes",
        quizzesDesc: "Test your knowledge with interactive quizzes",
        flashcards: "Flashcards",
        flashcardsDesc: "Review key concepts with flashcards",
        materials: "Study Materials",
        materialsDesc: "Access your study resources",
        tests: "Practice Tests",
        testsDesc: "Take full-length practice exams",
        analytics: "Analytics",
        analyticsDesc: "Track your progress and performance",
        settings: "Settings",
        settingsDesc: "Customize your learning experience",
      },
      arabic: {
        quickAccess: "الوصول السريع",
        aiTutor: "المدرس الذكي",
        aiTutorDesc: "احصل على مساعدة شخصية في دراستك",
        quizzes: "الاختبارات",
        quizzesDesc: "اختبر معرفتك بالاختبارات التفاعلية",
        flashcards: "البطاقات التعليمية",
        flashcardsDesc: "راجع المفاهيم الأساسية بالبطاقات",
        materials: "المواد الدراسية",
        materialsDesc: "الوصول إلى مواردك الدراسية",
        tests: "الاختبارات التدريبية",
        testsDesc: "خذ اختبارات تدريبية كاملة",
        analytics: "التحليلات",
        analyticsDesc: "تتبع تقدمك وأداءك",
        settings: "الإعدادات",
        settingsDesc: "خصص تجربة التعلم الخاصة بك",
      },
      hindi: {
        quickAccess: "त्वरित पहुंच",
        aiTutor: "AI शिक्षक",
        aiTutorDesc: "अपनी पढ़ाई में व्यक्तिगत सहायता प्राप्त करें",
        quizzes: "प्रश्नोत्तरी",
        quizzesDesc: "इंटरैक्टिव क्विज़ के साथ अपने ज्ञान का परीक्षण करें",
        flashcards: "फ्लैशकार्ड",
        flashcardsDesc: "फ्लैशकार्ड के साथ मुख्य अवधारणाओं की समीक्षा करें",
        materials: "अध्ययन सामग्री",
        materialsDesc: "अपने अध्ययन संसाधनों तक पहुंचें",
        tests: "अभ्यास परीक्षा",
        testsDesc: "पूर्ण-लंबाई अभ्यास परीक्षा लें",
        analytics: "विश्लेषण",
        analyticsDesc: "अपनी प्रगति और प्रदर्शन को ट्रैक करें",
        settings: "सेटिंग्स",
        settingsDesc: "अपने सीखने के अनुभव को अनुकूलित करें",
      },
    };
    return texts[language]?.[key as TextKey] || texts.english[key as TextKey];
  };

  const menuItems = [
    {
      icon: <MessageSquare className="h-6 w-6 text-blue-600" />,
      label: getLocalizedText("aiTutor"),
      description: getLocalizedText("aiTutorDesc"),
      onClick: onTutorClick,
      gradient:
        "from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20",
    },
    {
      icon: <Brain className="h-6 w-6 text-purple-600" />,
      label: getLocalizedText("quizzes"),
      description: getLocalizedText("quizzesDesc"),
      onClick: onQuizClick,
      gradient:
        "from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-green-600" />,
      label: getLocalizedText("flashcards"),
      description: getLocalizedText("flashcardsDesc"),
      onClick: onFlashcardsClick,
      gradient:
        "from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20",
    },
    {
      icon: <Book className="h-6 w-6 text-orange-600" />,
      label: getLocalizedText("materials"),
      description: getLocalizedText("materialsDesc"),
      onClick: onMaterialsClick,
      gradient:
        "from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20",
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-yellow-600" />,
      label: getLocalizedText("tests"),
      description: getLocalizedText("testsDesc"),
      onClick: onTestsClick,
      gradient:
        "from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-800/20",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-indigo-600" />,
      label: getLocalizedText("analytics"),
      description: getLocalizedText("analyticsDesc"),
      onClick: onAnalyticsClick,
      gradient:
        "from-indigo-100 to-indigo-50 dark:from-indigo-900/30 dark:to-indigo-800/20",
    },
    {
      icon: <Settings className="h-6 w-6 text-gray-600" />,
      label: getLocalizedText("settings"),
      description: getLocalizedText("settingsDesc"),
      onClick: onSettingsClick,
      gradient:
        "from-gray-100 to-gray-50 dark:from-gray-900/30 dark:to-gray-800/20",
    },
  ];

  return (
    <div className={`w-full bg-background py-6 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 slide-up">
          {getLocalizedText("quickAccess")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <QuickAccessItem
                icon={item.icon}
                label={item.label}
                description={item.description}
                onClick={item.onClick}
                gradient={item.gradient}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickAccessMenu;
