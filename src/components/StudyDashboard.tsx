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
  isRTL?: boolean;
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
      date: "2023-06-15",
      daysLeft: 30,
    },
    {
      id: "2",
      title: "Kerala PSC Preliminary",
      date: "2023-07-10",
      daysLeft: 55,
    },
  ],
  achievements = [
    {
      id: "1",
      title: "Quick Learner",
      description: "Completed 5 quizzes in one day",
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      date: "2023-05-10",
    },
    {
      id: "2",
      title: "Consistent Scholar",
      description: "Maintained a 7-day study streak",
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      date: "2023-05-12",
    },
  ],
  studyStreak = 7,
  isRTL = false,
}) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className={`w-full bg-background p-4 md:p-6 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold">
              {isRTL ? `مرحباً، ${userName}` : `Hello, ${userName}`}
            </h1>
            <p className="text-muted-foreground">
              {isRTL
                ? "هذه هي خطة دراستك اليومية"
                : "Here's your daily study plan"}
            </p>
          </div>
          <div className="flex items-center mt-2 md:mt-0">
            <Badge variant="outline" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>
                {isRTL
                  ? `سلسلة الدراسة: ${studyStreak} أيام`
                  : `Study Streak: ${studyStreak} days`}
              </span>
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="goals" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="goals">
              {isRTL ? "الأهداف اليومية" : "Daily Goals"}
            </TabsTrigger>
            <TabsTrigger value="exams">
              {isRTL ? "الامتحانات القادمة" : "Upcoming Exams"}
            </TabsTrigger>
            <TabsTrigger value="achievements">
              {isRTL ? "الإنجازات" : "Achievements"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="goals" className="space-y-4">
            {dailyGoals.map((goal) => (
              <Card key={goal.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{goal.title}</h3>
                    <Badge variant="outline">{goal.dueDate}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{isRTL ? "التقدم" : "Progress"}</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="exams" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isRTL ? "الامتحانات القادمة" : "Upcoming Exams"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingExams.map((exam) => (
                      <div
                        key={exam.id}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <h3 className="font-medium">{exam.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {exam.date}
                          </p>
                        </div>
                        <Badge className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {exam.daysLeft} {isRTL ? "يوم" : "days"}
                          </span>
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? "التقويم" : "Calendar"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="bg-muted rounded-full p-3">
                      {achievement.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {achievement.date}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "إحصائيات الدراسة" : "Study Statistics"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                <Target className="h-8 w-8 text-primary mb-2" />
                <h3 className="text-xl font-bold">85%</h3>
                <p className="text-sm text-muted-foreground text-center">
                  {isRTL ? "معدل إكمال الأهداف" : "Goal Completion Rate"}
                </p>
              </div>
              <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                <Clock className="h-8 w-8 text-primary mb-2" />
                <h3 className="text-xl font-bold">12.5</h3>
                <p className="text-sm text-muted-foreground text-center">
                  {isRTL
                    ? "ساعات الدراسة هذا الأسبوع"
                    : "Study Hours This Week"}
                </p>
              </div>
              <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                <CalendarIcon className="h-8 w-8 text-primary mb-2" />
                <h3 className="text-xl font-bold">7</h3>
                <p className="text-sm text-muted-foreground text-center">
                  {isRTL ? "أيام متتالية" : "Consecutive Days"}
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
