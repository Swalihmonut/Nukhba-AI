"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // 💡 FIXED: Added the missing Button import
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
  language?: 'english' | 'arabic';
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
    }
  };

  const getLocalizedText = (key: string) => {
    const texts: Record<"english" | "arabic", Record<string, string>> = {
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
    };
    return texts[language]?.[key] || texts.english[key];
  };

  return (
    <div
      className={`w-full bg-background p-4 md:p-6 ${isRTL ? "rtl" : "ltr"}`}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold">{getLocalizedText("hello")}</h1>
            <p className="text-muted-foreground">
              {getLocalizedText("dailyPlan")}
            </p>
          </div>
          <div className="flex items-center mt-2 md:mt-0">
            <Badge
              variant="outline"
              className="flex items-center gap-1"
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
              const isCompleted = completedGoals.includes(goal.id) || goal.progress === 100;
              return (
                <Card
                  key={goal.id}
                  className={`${isCompleted ? "bg-green-50 dark:bg-green-900/20" : ""}`}
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
                      <Progress value={goal.progress} />
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
              <Card>
                <CardHeader>
                  <CardTitle>{getLocalizedText("upcomingExams")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingExams.map((exam) => (
                      <div
                        key={exam.id}
                        className="flex justify-between items-center p-3 rounded-lg bg-muted/30 cursor-pointer"
                        onClick={() => onExamClick(exam.id)}
                      >
                        <div>
                          <h3 className="font-medium">{exam.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(exam.date).toLocaleDateString(
                              language === "arabic" ? "ar-SA" : "en-US",
                            )}
                          </p>
                        </div>
                        <Badge>
                          <Clock className="h-3 w-3 mr-1" />
                          {exam.daysLeft} {getLocalizedText("days")}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{getLocalizedText("calendar")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    required
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
            {achievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div>{achievement.icon}</div>
                  <div>
                    <h3 className="font-medium">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudyDashboard;
