"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoonIcon, SunIcon, Globe, Sparkles } from "lucide-react";

export default function Home() {
  const { theme, setTheme } = useTheme();

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-background">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Nukhba AI</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="outline" size="icon">
              <Globe className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Switch Language</span>
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center py-16">
          <Badge className="mb-4">
            The Future of Competitive Exam Prep
          </Badge>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Welcome to Nukhba AI
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your personalized AI-powered platform to ace competitive exams. Get started by exploring the features below.
          </p>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Tutor</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Get instant, personalized answers to your toughest questions.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Study Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Track your progress, set goals, and stay motivated.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Gamification</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Earn points, unlock achievements, and climb the leaderboard.</p>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="w-full mt-16 text-center text-sm text-muted-foreground">
          <p>© 2025 Nukhba AI. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}