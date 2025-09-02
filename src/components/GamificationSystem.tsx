"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Trophy,
  Star,
  Target,
  Users,
  Gift,
  Flame,
  Award,
  Crown,
  Zap,
  Share2,
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  points: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  rank: number;
  avatar: string;
  streak: number;
}

interface GamificationSystemProps {
  language?: "english" | "arabic" | "hindi";
  userId?: string;
  onShareReferral?: (code: string) => void;
}

const GamificationSystem = ({
  language = "english",
  userId = "user123",
  onShareReferral = () => {},
}: GamificationSystemProps) => {
  const [userPoints, setUserPoints] = useState(1250);
  const [userLevel, setUserLevel] = useState(5);
  const [userStreak, setUserStreak] = useState(12);
  const [referralCode] = useState("NUKHBA123");
  const [showCelebration, setShowCelebration] = useState(false);
  const isRTL = language === "arabic";

  const getLocalizedText = (key: string) => {
    const texts: Record<
      "english" | "arabic" | "hindi",
      Record<string, string>
    > = {
      english: {
        gamification: "Gamification",
        achievements: "Achievements",
        leaderboard: "Leaderboard",
        referrals: "Referrals",
        level: "Level",
        points: "Points",
        streak: "Day Streak",
        nextLevel: "Next Level",
        unlocked: "Unlocked!",
        locked: "Locked",
        progress: "Progress",
        shareCode: "Share Referral Code",
        earnPoints: "Earn 100 points for each friend who joins!",
        topLearners: "Top Learners",
        yourRank: "Your Rank",
        celebrate: "Celebrate Achievement",
        common: "Common",
        rare: "Rare",
        epic: "Epic",
        legendary: "Legendary",
      },
      arabic: {
        gamification: "نظام التحفيز",
        achievements: "الإنجازات",
        leaderboard: "لوحة المتصدرين",
        referrals: "الإحالات",
        level: "المستوى",
        points: "النقاط",
        streak: "سلسلة الأيام",
        nextLevel: "المستوى التالي",
        unlocked: "مفتوح!",
        locked: "مقفل",
        progress: "التقدم",
        shareCode: "مشاركة رمز الإحالة",
        earnPoints: "احصل على 100 نقطة لكل صديق ينضم!",
        topLearners: "أفضل المتعلمين",
        yourRank: "ترتيبك",
        celebrate: "احتفل بالإنجاز",
        common: "عادي",
        rare: "نادر",
        epic: "ملحمي",
        legendary: "أسطوري",
      },
      hindi: {
        gamification: "गेमिफिकेशन",
        achievements: "उपलब्धियां",
        leaderboard: "लीडरबोर्ड",
        referrals: "रेफरल",
        level: "स्तर",
        points: "अंक",
        streak: "दिन की लकीर",
        nextLevel: "अगला स्तर",
        unlocked: "अनलॉक!",
        locked: "लॉक",
        progress: "प्रगति",
        shareCode: "रेफरल कोड साझा करें",
        earnPoints: "हर दोस्त के जुड़ने पर 100 अंक कमाएं!",
        topLearners: "शीर्ष शिक्षार्थी",
        yourRank: "आपकी रैंक",
        celebrate: "उपलब्धि मनाएं",
        common: "सामान्य",
        rare: "दुर्लभ",
        epic: "महाकाव्य",
        legendary: "पौराणिक",
      },
    };
    return texts[language]?.[key] || texts.english[key];
  };

  const achievements: Achievement[] = [
    {
      id: "first-quiz",
      title: "First Steps",
      description: "Complete your first quiz",
      icon: <Target className="h-6 w-6" />,
      unlocked: true,
      progress: 1,
      maxProgress: 1,
      points: 50,
      rarity: "common",
    },
    {
      id: "week-streak",
      title: "Consistent Learner",
      description: "Maintain a 7-day study streak",
      icon: <Flame className="h-6 w-6" />,
      unlocked: true,
      progress: 7,
      maxProgress: 7,
      points: 200,
      rarity: "rare",
    },
    {
      id: "ai-master",
      title: "AI Tutor Master",
      description: "Ask 100 questions to AI tutor",
      icon: <Zap className="h-6 w-6" />,
      unlocked: false,
      progress: 45,
      maxProgress: 100,
      points: 500,
      rarity: "epic",
    },
    {
      id: "perfect-score",
      title: "Perfectionist",
      description: "Score 100% on 5 consecutive quizzes",
      icon: <Crown className="h-6 w-6" />,
      unlocked: false,
      progress: 2,
      maxProgress: 5,
      points: 1000,
      rarity: "legendary",
    },
  ];

  const leaderboard: LeaderboardEntry[] = [
    {
      id: "1",
      name: "Ahmed Al-Rashid",
      points: 2850,
      rank: 1,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed",
      streak: 25,
    },
    {
      id: "2",
      name: "Priya Sharma",
      points: 2340,
      rank: 2,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
      streak: 18,
    },
    {
      id: "3",
      name: "Mohammed Hassan",
      points: 1980,
      rank: 3,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mohammed",
      streak: 15,
    },
    {
      id: userId,
      name: "You",
      points: userPoints,
      rank: 7,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
      streak: userStreak,
    },
  ];

  const getRarityColor = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "rare":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "epic":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "legendary":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const calculateLevelProgress = () => {
    const pointsForCurrentLevel = userLevel * 200;
    const pointsForNextLevel = (userLevel + 1) * 200;
    const currentLevelPoints = userPoints - pointsForCurrentLevel;
    const pointsNeeded = pointsForNextLevel - pointsForCurrentLevel;
    return (currentLevelPoints / pointsNeeded) * 100;
  };

  const celebrateAchievement = (achievement: Achievement) => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);

    // Create confetti effect
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement("div");
        confetti.className = "fixed w-2 h-2 bg-yellow-400 confetti z-50";
        confetti.style.left = Math.random() * window.innerWidth + "px";
        confetti.style.top = "-10px";
        document.body.appendChild(confetti);
        setTimeout(() => {
          if (document.body.contains(confetti)) {
            document.body.removeChild(confetti);
          }
        }, 3000);
      }, i * 50);
    }
  };

  const shareReferralCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Nukhba AI",
          text: `Use my referral code ${referralCode} to get started with Nukhba AI!`,
          url: `https://nukhba.ai/join?ref=${referralCode}`,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(referralCode);
      onShareReferral(referralCode);
    }
  };

  return (
    <div className={`w-full space-y-6 ${isRTL ? "rtl" : "ltr"}`}>
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce">🎉</div>
          <div className="absolute text-2xl font-bold text-yellow-600 animate-pulse">
            {getLocalizedText("unlocked")}
          </div>
        </div>
      )}

      {/* User Stats */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{userLevel}</div>
              <div className="text-sm text-muted-foreground">
                {getLocalizedText("level")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {userPoints}
              </div>
              <div className="text-sm text-muted-foreground">
                {getLocalizedText("points")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 flex items-center justify-center gap-1">
                <Flame className="h-6 w-6" />
                {userStreak}
              </div>
              <div className="text-sm text-muted-foreground">
                {getLocalizedText("streak")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">#7</div>
              <div className="text-sm text-muted-foreground">
                {getLocalizedText("yourRank")}
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>{getLocalizedText("nextLevel")}</span>
              <span>{Math.round(calculateLevelProgress())}%</span>
            </div>
            <Progress value={calculateLevelProgress()} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="achievements">
            <Trophy className="h-4 w-4 mr-2" />
            {getLocalizedText("achievements")}
          </TabsTrigger>
          <TabsTrigger value="leaderboard">
            <Crown className="h-4 w-4 mr-2" />
            {getLocalizedText("leaderboard")}
          </TabsTrigger>
          <TabsTrigger value="referrals">
            <Gift className="h-4 w-4 mr-2" />
            {getLocalizedText("referrals")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`transition-all duration-300 hover:shadow-md ${
                  achievement.unlocked
                    ? "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800"
                    : "opacity-75"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-full ${
                        achievement.unlocked
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {achievement.icon}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <Badge className={getRarityColor(achievement.rarity)}>
                          {getLocalizedText(achievement.rarity)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-primary">
                          +{achievement.points} {getLocalizedText("points")}
                        </div>
                        {achievement.unlocked ? (
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-600"
                          >
                            {getLocalizedText("unlocked")}
                          </Badge>
                        ) : (
                          <div className="text-xs text-muted-foreground">
                            {achievement.progress}/{achievement.maxProgress}
                          </div>
                        )}
                      </div>
                      {!achievement.unlocked && (
                        <Progress
                          value={
                            (achievement.progress / achievement.maxProgress) *
                            100
                          }
                          className="h-1"
                        />
                      )}
                      {achievement.unlocked && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => celebrateAchievement(achievement)}
                          className="w-full"
                        >
                          <Star className="h-4 w-4 mr-2" />
                          {getLocalizedText("celebrate")}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                {getLocalizedText("topLearners")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                      entry.id === userId
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          entry.rank === 1
                            ? "bg-yellow-500 text-white"
                            : entry.rank === 2
                              ? "bg-gray-400 text-white"
                              : entry.rank === 3
                                ? "bg-orange-500 text-white"
                                : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {entry.rank <= 3 ? (
                          <Crown className="h-4 w-4" />
                        ) : (
                          entry.rank
                        )}
                      </div>
                      <img
                        src={entry.avatar}
                        alt={entry.name}
                        className="w-10 h-10 rounded-full"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{entry.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span>
                          {entry.points} {getLocalizedText("points")}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          {entry.streak}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-green-500" />
                {getLocalizedText("referrals")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                <Gift className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="text-xl font-bold mb-2">Invite Friends</h3>
                <p className="text-muted-foreground mb-4">
                  {getLocalizedText("earnPoints")}
                </p>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border mb-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    Your Referral Code
                  </div>
                  <div className="text-2xl font-mono font-bold">
                    {referralCode}
                  </div>
                </div>
                <Button onClick={shareReferralCode} className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  {getLocalizedText("shareCode")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationSystem;
