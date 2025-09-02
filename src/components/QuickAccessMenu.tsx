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

// ... (rest of the component code remains the same)

const QuickAccessMenu = ({
  language = "english",
  // ... (rest of the props)
}: QuickAccessMenuProps) => {
  const { theme } = useTheme();
  const isRTL = language === "arabic";

  const getLocalizedText = (key: string) => {
    const texts: Record<
      "english" | "arabic" | "hindi",
      Record<string, string>
    > = {
      english: {
        quickAccess: "Quick Access",
        aiTutor: "AI Tutor",
        aiTutorDesc: "Get personalized help with your studies",
        // ... all other English text
      },
      arabic: {
        // ... all Arabic text
      },
      hindi: {
        // ... all Hindi text
      },
    };
    return texts[language]?.[key] || texts.english[key];
  };

  // ... (rest of the component code)
};

export default QuickAccessMenu;
