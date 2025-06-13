"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  Target,
  Trophy,
} from "lucide-react";

interface StudyGoal {
  id: string;
  title: string;
  progress: number;
  dueDate: string;
}

interface Exam {
  id: string;
  title: string;
  date: string;
  daysLeft: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  date: string;
}

interface StudyDashboardProps {
  userName?: string;
  dailyGoals?: StudyGoal[];
  upcomingExams?: Exam[];
  achievements?: Achievement[];
  studyStreak?: number;
  language?: "english" | "arabic" | "hindi";
  onGoalComplete?: (goalId: string) => void;
  onExamClick?: (examId: string) => void;
}

const StudyDashboard: React.FC<StudyDashboardProps> = ({
  userName = "Student",
  dailyGoals = [
    {
      id: "1",
      title: "Complete UGC-NET Arabic Module 3",
      progress: 65,
      dueDate: "Today",
    },
    {
      id: "2",
      title: "Practice Quantitative Aptitude",
      progress: 30,
      dueDate: "Today",
    },
    {
      id: "3",
      title: "Review General Paper I Notes",
      progress: 80,
      dueDate: "Tomorrow",
    },
  ],
  upcomingExams = [
    {
      id: "1",
      title: "UGC-NET Arabic Paper II",
      date: "2024-06-15",
      daysLeft: 30,
    },
    {
      id: "2",
      title: "Kerala PSC Preliminary",
      date: "2024-07-10",
      daysLeft: 55,
    },
  ],
  achievements = [
    {
      id: "1",
      title: "Quick Learner",
      description: "Completed 5 quizzes in one day",
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      date: "2024-01-10",
    },
    {
      id: "2",
      title: "Consistent Scholar",
      description: "Maintained a 7-day study streak",
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      date: "2024-01-12",
    },
  ],
  studyStreak = 7,
  language = "english",
  onGoalComplete = () => {},
  onExamClick = () => {},
}) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [completedGoals, setCompletedGoals] = React.useState<string[]>([]);
  const isRTL = language === "arabic";

  const handleGoalComplete = (goalId: string) => {
    if (!completedGoals.includes(goalId)) {
      setCompletedGoals([...completedGoals, goalId]);
      onGoalComplete(goalId);
      // Trigger confetti animation
      const confetti = document.createElement("div");
      confetti.className =
        "fixed top-1/2 left-1/2 w-4 h-4 bg-yellow-400 confetti z-50";
      document.body.appendChild(confetti);
      setTimeout(() => document.body.removeChild(confetti), 3000);
    }
  };

  const getLocalizedText = (key: string) => {
    const texts = {
      english: {
        hello: `Hello, ${userName}`,
        dailyPlan: "Here's your daily study plan",
        studyStreak: `Study Streak: ${studyStreak} days`,
        dailyGoals: "Daily Goals",
        upcomingExams: "Upcoming Exams",
        achievements: "Achievements",
        progress: "Progress",
        days: "days",
        calendar: "Calendar",
        studyStats: "Study Statistics",
        goalCompletion: "Goal Completion Rate",
        studyHours: "Study Hours This Week",
        consecutiveDays: "Consecutive Days",
        complete: "Complete",
        completed: "Completed",
      },
      arabic: {
        hello: `مرحباً، ${userName}`,
        dailyPlan: "هذه هي خطة دراستك اليومية",
        studyStreak: `سلسلة الدراسة: ${studyStreak} أيام`,
        dailyGoals: "الأهداف اليومية",
        upcomingExams: "الامتحانات القادمة",
        achievements: "الإنجازات",
        progress: "التقدم",
        days: "يوم",
        calendar: "التقويم",
        studyStats: "إحصائيات الدراسة",
        goalCompletion: "معدل إكمال الأهداف",
        studyHours: "ساعات الدراسة هذا الأسبوع",
        consecutiveDays: "أيام متتالية",
        complete: "إكمال",
        completed: "مكتمل",
      },
      hindi: {
        hello: `नमस्ते, ${userName}`,
        dailyPlan: "यहाँ आपकी दैनिक अध्ययन योजना है",
        studyStreak: `अध्ययन श्रृंखला: ${studyStreak} दिन`,
        dailyGoals: "दैनिक लक्ष्य",
        upcomingExams: "आगामी परीक्षाएं",
        achievements: "उपलब्धियां",
        progress: "प्रगति",
        days: "दिन",
        calendar: "कैलेंडर",
        studyStats: "अध्ययन आंकड़े",
        goalCompletion: "लक्ष्य पूर्णता दर",
        studyHours: "इस सप्ताह अध्ययन घंटे",
        consecutiveDays: "लगातार दिन",
        complete: "पूर्ण करें",
        completed: "पूर्ण",
      },
    };
    return texts[language]?.[key] || texts.english[key];
  };

  return (
    <div
      className={`w-full bg-background p-4 md:p-6 slide-up ${isRTL ? "rtl" : "ltr"}`}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold bounce-in">
              {getLocalizedText("hello")}
            </h1>
            <p className="text-muted-foreground">
              {getLocalizedText("dailyPlan")}
            </p>
          </div>
          <div className="flex items-center mt-2 md:mt-0">
            <Badge
              variant="outline"
              className="flex items-center gap-1 bg-gradient-to-r from-primary/10 to-primary/20"
            >
              <BookOpen className="h-4 w-4" />
              <span>{getLocalizedText("studyStreak")}</span>
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="goals" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="goals">
              {getLocalizedText("dailyGoals")}
            </TabsTrigger>
            <TabsTrigger value="exams">
              {getLocalizedText("upcomingExams")}
            </TabsTrigger>
            <TabsTrigger value="achievements">
              {getLocalizedText("achievements")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="goals" className="space-y-4">
            {dailyGoals.map((goal) => {
              const isCompleted =
                completedGoals.includes(goal.id) || goal.progress === 100;
              return (
                <Card
                  key={goal.id}
                  className={`transition-all duration-300 hover:shadow-md ${isCompleted ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3
                        className={`font-medium ${isCompleted ? "line-through text-muted-foreground" : ""}`}
                      >
                        {goal.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{goal.dueDate}</Badge>
                        {isCompleted && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{getLocalizedText("progress")}</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <Progress
                        value={goal.progress}
                        className="transition-all duration-500"
                      />
                      {!isCompleted && goal.progress >= 80 && (
                        <Button
                          size="sm"
                          onClick={() => handleGoalComplete(goal.id)}
                          className="w-full mt-2"
                        >
                          {getLocalizedText("complete")}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="exams" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{getLocalizedText("upcomingExams")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingExams.map((exam) => (
                      <div
                        key={exam.id}
                        className="flex justify-between items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => onExamClick(exam.id)}
                      >
                        <div>
                          <h3 className="font-medium">{exam.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(exam.date).toLocaleDateString(
                              language === "arabic"
                                ? "ar-SA"
                                : language === "hindi"
                                  ? "hi-IN"
                                  : "en-US",
                            )}
                          </p>
                        </div>
                        <Badge
                          className={`flex items-center gap-1 ${
                            exam.daysLeft <= 7
                              ? "bg-red-500 hover:bg-red-600"
                              : exam.daysLeft <= 30
                                ? "bg-yellow-500 hover:bg-yellow-600"
                                : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          <Clock className="h-3 w-3" />
                          <span>
                            {exam.daysLeft} {getLocalizedText("days")}
                          </span>
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{getLocalizedText("calendar")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <Card
                  key={achievement.id}
                  className="hover:shadow-md transition-all duration-300 bounce-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-full p-3">
                      {achievement.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(achievement.date).toLocaleDateString(
                          language === "arabic"
                            ? "ar-SA"
                            : language === "hindi"
                              ? "hi-IN"
                              : "en-US",
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {getLocalizedText("studyStats")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg hover:scale-105 transition-transform">
                <Target className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="text-xl font-bold text-green-700 dark:text-green-400">
                  85%
                </h3>
                <p className="text-sm text-muted-foreground text-center">
                  {getLocalizedText("goalCompletion")}
                </p>
              </div>
              <div className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg hover:scale-105 transition-transform">
                <Clock className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400">
                  12.5
                </h3>
                <p className="text-sm text-muted-foreground text-center">
                  {getLocalizedText("studyHours")}
                </p>
              </div>
              <div className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg hover:scale-105 transition-transform">
                <CalendarIcon className="h-8 w-8 text-purple-600 mb-2" />
                <h3 className="text-xl font-bold text-purple-700 dark:text-purple-400">
                  {studyStreak}
                </h3>
                <p className="text-sm text-muted-foreground text-center">
                  {getLocalizedText("consecutiveDays")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudyDashboard;
