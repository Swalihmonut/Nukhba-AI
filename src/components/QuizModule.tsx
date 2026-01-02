"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import {
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  ArrowRight,
  BookOpen,
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation?: string;
  language: "english" | "arabic" | "hindi";
  subject: string;
}

interface QuizModuleProps {
  language?: "english" | "arabic" | "hindi";
  onComplete?: (score: number, total: number) => void;
}

// Sample questions for exam preparation
const SAMPLE_QUESTIONS: Question[] = [
  {
    id: "1",
    question:
      "What is the primary purpose of the UGC NET Paper 1 General Paper?",
    options: [
      "To test subject-specific knowledge",
      "To assess teaching and research aptitude",
      "To evaluate language proficiency",
      "To measure mathematical skills",
    ],
    correctAnswer: 1,
    explanation:
      "UGC NET Paper 1 is designed to assess teaching and research aptitude, including reasoning ability, comprehension, and general awareness.",
    language: "english",
    subject: "UGC NET Paper 1",
  },
  {
    id: "2",
    question:
      "في النحو العربي، ما هو تعريف 'المبتدأ والخبر'؟",
    options: [
      "جملة فعلية تتكون من فعل وفاعل",
      "جملة اسمية تتكون من مبتدأ وخبر",
      "أداة ربط بين الجمل",
      "نوع من أنواع الجمع",
    ],
    correctAnswer: 1,
    explanation:
      "المبتدأ والخبر هما ركنا الجملة الاسمية، حيث المبتدأ هو ما نبدأ به الكلام والخبر هو ما نخبر به عن المبتدأ.",
    language: "arabic",
    subject: "Arabic Grammar",
  },
  {
    id: "3",
    question:
      "Which of the following is NOT a characteristic of effective teaching?",
    options: [
      "Clear communication",
      "Student-centered approach",
      "Rote memorization",
      "Active engagement",
    ],
    correctAnswer: 2,
    explanation:
      "Rote memorization is not considered an effective teaching method. Effective teaching focuses on understanding, critical thinking, and active learning.",
    language: "english",
    subject: "Teaching Aptitude",
  },
  {
    id: "4",
    question:
      "किसी संख्या का 25% उसी संख्या के 20% से 15 अधिक है। संख्या क्या है?",
    options: ["200", "250", "300", "350"],
    correctAnswer: 2,
    explanation:
      "माना संख्या x है। तो 0.25x = 0.20x + 15, जिससे 0.05x = 15, अतः x = 300",
    language: "hindi",
    subject: "Quantitative Aptitude",
  },
  {
    id: "5",
    question:
      "What is the main difference between formative and summative assessment?",
    options: [
      "Formative is for grading, summative is for feedback",
      "Formative provides ongoing feedback, summative evaluates final learning",
      "There is no difference",
      "Formative is optional, summative is mandatory",
    ],
    correctAnswer: 1,
    explanation:
      "Formative assessment is ongoing and provides feedback during learning, while summative assessment evaluates learning at the end of a period.",
    language: "english",
    subject: "Research & Teaching Aptitude",
  },
];

const QuizModule: React.FC<QuizModuleProps> = ({
  language = "english",
  onComplete,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const isRTL = language === "arabic";

  // Filter questions by language or use all questions
  const questions = SAMPLE_QUESTIONS.filter(
    (q) => q.language === language || language === "english"
  ).slice(0, 5);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const score = Array.from(answers.values()).reduce((acc, answer, idx) => {
    return acc + (answer === questions[idx]?.correctAnswer ? 1 : 0);
  }, 0);

  const getLocalizedText = (key: string): string => {
    type TextKey =
      | "quiz"
      | "question"
      | "of"
      | "next"
      | "submit"
      | "retake"
      | "score"
      | "correct"
      | "incorrect"
      | "explanation"
      | "yourScore"
      | "outOf"
      | "excellent"
      | "good"
      | "needsImprovement"
      | "startQuiz"
      | "selectAnswer"
      | "complete";
    const texts: Record<
      "english" | "arabic" | "hindi",
      Record<TextKey, string>
    > = {
      english: {
        quiz: "Quiz",
        question: "Question",
        of: "of",
        next: "Next",
        submit: "Submit Answer",
        retake: "Retake Quiz",
        score: "Score",
        correct: "Correct!",
        incorrect: "Incorrect",
        explanation: "Explanation",
        yourScore: "Your Score",
        outOf: "out of",
        excellent: "Excellent work!",
        good: "Good job!",
        needsImprovement: "Keep practicing!",
        startQuiz: "Start Quiz",
        selectAnswer: "Please select an answer",
        complete: "Complete",
      },
      arabic: {
        quiz: "الاختبار",
        question: "السؤال",
        of: "من",
        next: "التالي",
        submit: "إرسال الإجابة",
        retake: "إعادة الاختبار",
        score: "النتيجة",
        correct: "صحيح!",
        incorrect: "خطأ",
        explanation: "الشرح",
        yourScore: "نتيجتك",
        outOf: "من",
        excellent: "عمل ممتاز!",
        good: "عمل جيد!",
        needsImprovement: "استمر في الممارسة!",
        startQuiz: "بدء الاختبار",
        selectAnswer: "يرجى اختيار إجابة",
        complete: "مكتمل",
      },
      hindi: {
        quiz: "प्रश्नोत्तरी",
        question: "प्रश्न",
        of: "का",
        next: "अगला",
        submit: "उत्तर सबमिट करें",
        retake: "प्रश्नोत्तरी दोबारा करें",
        score: "स्कोर",
        correct: "सही!",
        incorrect: "गलत",
        explanation: "स्पष्टीकरण",
        yourScore: "आपका स्कोर",
        outOf: "में से",
        excellent: "उत्कृष्ट काम!",
        good: "अच्छा काम!",
        needsImprovement: "अभ्यास जारी रखें!",
        startQuiz: "प्रश्नोत्तरी शुरू करें",
        selectAnswer: "कृपया एक उत्तर चुनें",
        complete: "पूर्ण",
      },
    };
    return texts[language]?.[key as TextKey] || texts.english[key as TextKey];
  };

  const handleAnswerSelect = (value: string) => {
    const answerIndex = parseInt(value);
    setSelectedAnswer(answerIndex);
    setAnswers((prev) => {
      const newMap = new Map(prev);
      newMap.set(currentQuestionIndex, answerIndex);
      return newMap;
    });
    setShowExplanation(false);
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(answers.get(currentQuestionIndex + 1) ?? null);
      setShowExplanation(false);
    } else {
      // Quiz complete
      setShowResult(true);
      if (onComplete) {
        onComplete(score + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0), questions.length);
      }
    }
  };

  const handleRetake = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers(new Map());
    setShowResult(false);
    setShowExplanation(false);
  };

  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;
  const hasAnswered = selectedAnswer !== null;

  if (showResult) {
    const finalScore = score;
    const percentage = (finalScore / questions.length) * 100;
    const performanceMessage =
      percentage >= 80
        ? getLocalizedText("excellent")
        : percentage >= 60
          ? getLocalizedText("good")
          : getLocalizedText("needsImprovement");

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="h-16 w-16 text-yellow-500" />
          </div>
          <CardTitle className="text-3xl mb-2">
            {getLocalizedText("quiz")} {getLocalizedText("complete")}
          </CardTitle>
          <p className="text-lg font-semibold text-primary">
            {performanceMessage}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {finalScore} {getLocalizedText("outOf")} {questions.length}
            </div>
            <div className="text-2xl text-muted-foreground">
              {Math.round(percentage)}%
            </div>
          </div>
          <div className="space-y-2">
            {questions.map((q, idx) => {
              const userAnswer = answers.get(idx);
              const isQCorrect = userAnswer === q.correctAnswer;
              return (
                <div
                  key={q.id}
                  className={`p-3 rounded-lg border ${
                    isQCorrect
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200"
                      : "bg-red-50 dark:bg-red-900/20 border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {isQCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className="font-medium">
                      {getLocalizedText("question")} {idx + 1}
                    </span>
                  </div>
                  <p className="text-sm">{q.question}</p>
                </div>
              );
            })}
          </div>
          <Button onClick={handleRetake} className="w-full" size="lg">
            <RotateCcw className="h-4 w-4 mr-2" />
            {getLocalizedText("retake")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {getLocalizedText("quiz")}
          </CardTitle>
          <Badge variant="outline">
            {currentQuestionIndex + 1} {getLocalizedText("of")}{" "}
            {questions.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
        <div>
          <Badge variant="secondary" className="mb-3">
            {currentQuestion.subject}
          </Badge>
          <h3 className="text-lg font-semibold mb-4">
            {getLocalizedText("question")} {currentQuestionIndex + 1}:{" "}
            {currentQuestion.question}
          </h3>
        </div>

        <RadioGroup
          value={selectedAnswer?.toString()}
          onValueChange={handleAnswerSelect}
        >
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = index === currentQuestion.correctAnswer;
            const showFeedback = hasAnswered && showExplanation;

            return (
              <div
                key={index}
                className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                  isSelected
                    ? showFeedback
                      ? isCorrect
                        ? "bg-green-50 dark:bg-green-900/20 border-green-500"
                        : "bg-red-50 dark:bg-red-900/20 border-red-500"
                      : "bg-primary/10 border-primary"
                    : showFeedback && isCorrectOption
                      ? "bg-green-50 dark:bg-green-900/20 border-green-300"
                      : "border-border hover:bg-muted/50"
                }`}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer"
                >
                  {option}
                </Label>
                {showFeedback && isSelected && (
                  <div>
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </RadioGroup>

        {hasAnswered && (
          <div className="space-y-3">
            <div
              className={`p-3 rounded-lg ${
                isCorrect
                  ? "bg-green-50 dark:bg-green-900/20"
                  : "bg-red-50 dark:bg-red-900/20"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-700 dark:text-green-400">
                      {getLocalizedText("correct")}
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-red-700 dark:text-red-400">
                      {getLocalizedText("incorrect")}
                    </span>
                  </>
                )}
              </div>
              {currentQuestion.explanation && (
                <div>
                  <p className="text-sm font-medium mb-1">
                    {getLocalizedText("explanation")}:
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            disabled={!hasAnswered}
            size="lg"
            className="min-w-[120px]"
          >
            {currentQuestionIndex < questions.length - 1 ? (
              <>
                {getLocalizedText("next")}
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              getLocalizedText("submit")
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizModule;

