"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Book, Brain, BookOpen, Lightbulb, MessageSquare } from "lucide-react";
import { useTheme } from "next-themes";

interface QuickAccessItemProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick?: () => void;
}

const QuickAccessItem = ({
  icon,
  label,
  description,
  onClick = () => {},
}: QuickAccessItemProps) => {
  return (
    <Card
      className="bg-card hover:bg-accent/50 transition-all cursor-pointer h-full"
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
        <div className="rounded-full bg-primary/10 p-3 mb-3">{icon}</div>
        <h3 className="font-medium text-lg mb-1">{label}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const QuickAccessMenu = () => {
  const { theme } = useTheme();

  const menuItems = [
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      label: "AI Tutor",
      description: "Get personalized help with your studies",
      onClick: () => console.log("AI Tutor clicked"),
    },
    {
      icon: <Brain className="h-6 w-6 text-primary" />,
      label: "Quizzes",
      description: "Test your knowledge with interactive quizzes",
      onClick: () => console.log("Quizzes clicked"),
    },
    {
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      label: "Flashcards",
      description: "Review key concepts with flashcards",
      onClick: () => console.log("Flashcards clicked"),
    },
    {
      icon: <Book className="h-6 w-6 text-primary" />,
      label: "Study Materials",
      description: "Access your study resources",
      onClick: () => console.log("Study Materials clicked"),
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-primary" />,
      label: "Practice Tests",
      description: "Take full-length practice exams",
      onClick: () => console.log("Practice Tests clicked"),
    },
  ];

  return (
    <div className="w-full bg-background py-6">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {menuItems.map((item, index) => (
            <QuickAccessItem
              key={index}
              icon={item.icon}
              label={item.label}
              description={item.description}
              onClick={item.onClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickAccessMenu;
