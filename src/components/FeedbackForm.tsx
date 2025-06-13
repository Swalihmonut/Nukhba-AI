"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  Star,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

interface FeedbackFormProps {
  context?: "quiz" | "tutor" | "flashcard" | "general";
  language?: "english" | "arabic" | "hindi";
  onSubmit?: (feedback: FeedbackData) => void;
  compact?: boolean;
}

interface FeedbackData {
  rating: number;
  category: string;
  message: string;
  context: string;
  timestamp: Date;
}

const FeedbackForm = ({
  context = "general",
  language = "english",
  onSubmit = () => {},
  compact = false,
}: FeedbackFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isRTL = language === "arabic";

  const getLocalizedText = (key: string) => {
    const texts = {
      english: {
        feedback: "Feedback",
        rateThi: "Rate this",
        quiz: "quiz",
        tutor: "AI tutor session",
        flashcard: "flashcard deck",
        general: "experience",
        howWasIt: "How was your experience?",
        selectRating: "Select a rating",
        category: "Category",
        selectCategory: "Select category",
        bug: "Bug Report",
        feature: "Feature Request",
        content: "Content Issue",
        ui: "UI/UX Feedback",
        performance: "Performance",
        other: "Other",
        message: "Message",
        messagePlaceholder: "Tell us more about your experience...",
        submit: "Submit Feedback",
        submitting: "Submitting...",
        thankYou: "Thank you for your feedback!",
        giveFeedback: "Give Feedback",
        quickFeedback: "Quick Feedback",
        helpful: "Helpful",
        notHelpful: "Not Helpful",
      },
      arabic: {
        feedback: "التعليقات",
        rateThi: "قيم هذا",
        quiz: "الاختبار",
        tutor: "جلسة المدرس الذكي",
        flashcard: "مجموعة البطاقات التعليمية",
        general: "التجربة",
        howWasIt: "كيف كانت تجربتك؟",
        selectRating: "اختر تقييماً",
        category: "الفئة",
        selectCategory: "اختر الفئة",
        bug: "تقرير خطأ",
        feature: "طلب ميزة",
        content: "مشكلة في المحتوى",
        ui: "تعليقات واجهة المستخدم",
        performance: "الأداء",
        other: "أخرى",
        message: "الرسالة",
        messagePlaceholder: "أخبرنا المزيد عن تجربتك...",
        submit: "إرسال التعليق",
        submitting: "جاري الإرسال...",
        thankYou: "شكراً لك على تعليقك!",
        giveFeedback: "قدم تعليقاً",
        quickFeedback: "تعليق سريع",
        helpful: "مفيد",
        notHelpful: "غير مفيد",
      },
      hindi: {
        feedback: "फीडबैक",
        rateThi: "इसे रेट करें",
        quiz: "क्विज़",
        tutor: "AI ट्यूटर सेशन",
        flashcard: "फ्लैशकार्ड डेक",
        general: "अनुभव",
        howWasIt: "आपका अनुभव कैसा था?",
        selectRating: "रेटिंग चुनें",
        category: "श्रेणी",
        selectCategory: "श्रेणी चुनें",
        bug: "बग रिपोर्ट",
        feature: "फीचर अनुरोध",
        content: "सामग्री समस्या",
        ui: "UI/UX फीडबैक",
        performance: "प्रदर्शन",
        other: "अन्य",
        message: "संदेश",
        messagePlaceholder: "अपने अनुभव के बारे में और बताएं...",
        submit: "फीडबैक सबमिट करें",
        submitting: "सबमिट हो रहा है...",
        thankYou: "आपके फीडबैक के लिए धन्यवाद!",
        giveFeedback: "फीडबैक दें",
        quickFeedback: "त्वरित फीडबैक",
        helpful: "सहायक",
        notHelpful: "सहायक नहीं",
      },
    };
    return texts[language]?.[key] || texts.english[key];
  };

  const categories = [
    { value: "bug", label: getLocalizedText("bug") },
    { value: "feature", label: getLocalizedText("feature") },
    { value: "content", label: getLocalizedText("content") },
    { value: "ui", label: getLocalizedText("ui") },
    { value: "performance", label: getLocalizedText("performance") },
    { value: "other", label: getLocalizedText("other") },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);

    const feedbackData: FeedbackData = {
      rating,
      category,
      message,
      context,
      timestamp: new Date(),
    };

    try {
      let retries = 2;
      let submitted = false;

      while (retries > 0 && !submitted) {
        try {
          // Simulate API call with potential failure
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              // 10% chance of submission failure
              if (Math.random() < 0.1) {
                reject(new Error("Submission failed"));
              } else {
                resolve(null);
              }
            }, 1000);
          });

          submitted = true;
          onSubmit(feedbackData);
          setIsSubmitted(true);

          // Reset form after delay
          setTimeout(() => {
            setIsSubmitted(false);
            setIsOpen(false);
            setRating(0);
            setCategory("");
            setMessage("");
          }, 2000);
        } catch (error) {
          retries--;
          if (retries === 0) {
            throw error;
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      // Could show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFeedback = (helpful: boolean) => {
    const feedbackData: FeedbackData = {
      rating: helpful ? 5 : 2,
      category: "quick",
      message: helpful ? "Helpful" : "Not helpful",
      context,
      timestamp: new Date(),
    };

    onSubmit(feedbackData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 2000);
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${isRTL ? "rtl" : "ltr"}`}>
        {!isSubmitted ? (
          <>
            <span className="text-sm text-muted-foreground">
              {getLocalizedText("quickFeedback")}:
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickFeedback(true)}
              className="h-8"
            >
              <ThumbsUp className="h-3 w-3 mr-1" />
              {getLocalizedText("helpful")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickFeedback(false)}
              className="h-8"
            >
              <ThumbsDown className="h-3 w-3 mr-1" />
              {getLocalizedText("notHelpful")}
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">{getLocalizedText("thankYou")}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${isRTL ? "rtl" : "ltr"}`}>
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="fixed bottom-4 left-4 z-40"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          {getLocalizedText("giveFeedback")}
        </Button>
      ) : (
        <Card className="fixed bottom-4 left-4 z-40 w-80 max-h-[80vh] overflow-y-auto">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                {getLocalizedText("feedback")}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="text-center py-6">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="text-lg font-semibold mb-2">
                  {getLocalizedText("thankYou")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your feedback helps us improve!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">
                    {getLocalizedText("rateThi")} {getLocalizedText(context)}
                  </Label>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-1 rounded transition-colors ${
                          star <= rating
                            ? "text-yellow-500"
                            : "text-gray-300 hover:text-yellow-400"
                        }`}
                      >
                        <Star className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="category" className="text-sm font-medium">
                    {getLocalizedText("category")}
                  </Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md bg-background"
                  >
                    <option value="">
                      {getLocalizedText("selectCategory")}
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-medium">
                    {getLocalizedText("message")}
                  </Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={getLocalizedText("messagePlaceholder")}
                    className="mt-1 min-h-[80px]"
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={rating === 0 || isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <AlertCircle className="h-4 w-4 mr-2 animate-spin" />
                      {getLocalizedText("submitting")}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {getLocalizedText("submit")}
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FeedbackForm;
export { type FeedbackData };
