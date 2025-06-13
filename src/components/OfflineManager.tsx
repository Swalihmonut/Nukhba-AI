"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { WifiOff, Wifi, RefreshCw, AlertCircle } from "lucide-react";

interface OfflineData {
  quizzes: any[];
  flashcards: any[];
  progress: any[];
  lastSync: Date;
}

interface OfflineManagerProps {
  language?: "english" | "arabic" | "hindi";
  onSyncComplete?: () => void;
}

const OfflineManager = ({
  language = "english",
  onSyncComplete = () => {},
}: OfflineManagerProps) => {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingSync, setPendingSync] = useState(0);
  const [offlineData, setOfflineData] = useState<OfflineData | null>(null);
  const isRTL = language === "arabic";

  const getLocalizedText = (key: string) => {
    const texts = {
      english: {
        offlineMode: "Offline Mode",
        onlineMode: "Online Mode",
        syncPending: "items pending sync",
        syncNow: "Sync Now",
        syncing: "Syncing...",
        lastSync: "Last sync:",
        offlineReady: "Offline content ready",
        noConnection: "No internet connection",
        syncComplete: "Sync completed successfully",
        syncFailed: "Sync failed. Will retry automatically.",
      },
      arabic: {
        offlineMode: "وضع عدم الاتصال",
        onlineMode: "وضع الاتصال",
        syncPending: "عناصر في انتظار المزامنة",
        syncNow: "مزامنة الآن",
        syncing: "جاري المزامنة...",
        lastSync: "آخر مزامنة:",
        offlineReady: "المحتوى غير المتصل جاهز",
        noConnection: "لا يوجد اتصال بالإنترنت",
        syncComplete: "تمت المزامنة بنجاح",
        syncFailed: "فشلت المزامنة. سيتم إعادة المحاولة تلقائياً.",
      },
      hindi: {
        offlineMode: "ऑफ़लाइन मोड",
        onlineMode: "ऑनलाइन मोड",
        syncPending: "सिंक के लिए लंबित आइटम",
        syncNow: "अभी सिंक करें",
        syncing: "सिंक हो रहा है...",
        lastSync: "अंतिम सिंक:",
        offlineReady: "ऑफ़लाइन सामग्री तैयार",
        noConnection: "कोई इंटरनेट कनेक्शन नहीं",
        syncComplete: "सिंक सफलतापूर्वक पूर्ण",
        syncFailed: "सिंक असफल। स्वचालित रूप से पुनः प्रयास करेगा।",
      },
    };
    return texts[language]?.[key] || texts.english[key];
  };

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-sync when coming back online
      if (pendingSync > 0) {
        handleSync();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check initial status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [pendingSync]);

  // Load offline data from localStorage
  useEffect(() => {
    const loadOfflineData = () => {
      try {
        const stored = localStorage.getItem("nukhba-offline-data");
        if (stored) {
          const data = JSON.parse(stored);
          setOfflineData(data);
        }

        const pending = localStorage.getItem("nukhba-pending-sync");
        if (pending) {
          setPendingSync(parseInt(pending, 10));
        }
      } catch (error) {
        console.error("Error loading offline data:", error);
      }
    };

    loadOfflineData();
  }, []);

  const handleSync = async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    try {
      let retries = 3;
      let syncSuccess = false;

      while (retries > 0 && !syncSuccess) {
        try {
          // Simulate API calls with potential failures
          const random = Math.random();

          if (random < 0.1) {
            throw new Error("Network connection lost during sync");
          } else if (random < 0.15) {
            throw new Error("Server temporarily unavailable");
          }

          // Simulate progressive sync
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Fetch quizzes
          const quizzes = [
            {
              id: "1",
              title: "Arabic Grammar Basics",
              questions: 20,
              completed: false,
            },
            {
              id: "2",
              title: "UGC-NET Paper I",
              questions: 50,
              completed: true,
            },
          ];

          await new Promise((resolve) => setTimeout(resolve, 500));

          // Fetch flashcards
          const flashcards = [
            { id: "1", deck: "Arabic Vocabulary", cards: 100, reviewed: 45 },
            { id: "2", deck: "General Knowledge", cards: 200, reviewed: 120 },
          ];

          await new Promise((resolve) => setTimeout(resolve, 500));

          // Sync progress data
          const progress = [
            {
              date: new Date().toISOString(),
              studyTime: 120,
              goalsCompleted: 3,
            },
          ];

          const newOfflineData: OfflineData = {
            quizzes,
            flashcards,
            progress,
            lastSync: new Date(),
          };

          setOfflineData(newOfflineData);
          localStorage.setItem(
            "nukhba-offline-data",
            JSON.stringify(newOfflineData),
          );

          // Clear pending sync
          setPendingSync(0);
          localStorage.removeItem("nukhba-pending-sync");

          syncSuccess = true;
          onSyncComplete();
        } catch (error) {
          retries--;
          console.error(`Sync attempt failed (${3 - retries}/3):`, error);

          if (retries === 0) {
            throw error;
          } else {
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }
      }
    } catch (error) {
      console.error("Sync failed after all retries:", error);

      // Schedule automatic retry
      setTimeout(() => {
        if (isOnline && !isSyncing) {
          handleSync();
        }
      }, 30000); // Retry after 30 seconds
    } finally {
      setIsSyncing(false);
    }
  };

  const addPendingSync = (count: number = 1) => {
    const newPending = pendingSync + count;
    setPendingSync(newPending);
    localStorage.setItem("nukhba-pending-sync", newPending.toString());
  };

  return (
    <Card className={`w-full bg-background border ${isRTL ? "rtl" : "ltr"}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            <span>
              {isOnline
                ? getLocalizedText("onlineMode")
                : getLocalizedText("offlineMode")}
            </span>
          </div>
          {pendingSync > 0 && (
            <Badge variant="outline" className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-3 w-3 mr-1 text-yellow-600" />
              {pendingSync} {getLocalizedText("syncPending")}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isOnline && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {getLocalizedText("offlineReady")}
            </p>
          </div>
        )}

        {isOnline && pendingSync > 0 && (
          <Button
            onClick={handleSync}
            disabled={isSyncing}
            className="w-full"
            variant="outline"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                {getLocalizedText("syncing")}
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                {getLocalizedText("syncNow")}
              </>
            )}
          </Button>
        )}

        {offlineData?.lastSync && (
          <p className="text-xs text-muted-foreground">
            {getLocalizedText("lastSync")}{" "}
            {offlineData.lastSync.toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default OfflineManager;
export { type OfflineData };
