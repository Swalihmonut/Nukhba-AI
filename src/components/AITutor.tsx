"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  Mic,
  Send,
  Volume2,
  Languages,
  RotateCcw,
  MessageSquare,
  MicOff,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useVoiceInteraction } from "@/hooks/useVoiceInteraction";
import { sendMessageToTutor, formatMessagesForAPI } from "@/services/tutor";
import FeedbackForm from "./FeedbackForm";
import { useToast } from "./ui/use-toast";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  language: "english" | "arabic" | "hindi";
  followUpQuestions?: string[];
}

interface AITutorProps {
  language?: "english" | "arabic" | "hindi";
  initialInteractionMode?: "text" | "voice";
  messages?: Message[];
  onLanguageChange?: (language: "english" | "arabic" | "hindi") => void;
}

function getWelcomeMessage(lang: "english" | "arabic" | "hindi") {
  const messages = {
    english:
      "Hello! I'm your AI tutor. How can I help you with your exam preparation today?",
    arabic:
      "مرحبًا! أنا مدرسك الذكي. كيف يمكنني مساعدتك في التحضير للامتحان اليوم؟",
    hindi:
      "नमस्ते! मैं आपका AI शिक्षक हूं। आज मैं आपकी परीक्षा की तैयारी में कैसे मदद कर सकता हूं?",
  };
  return messages[lang] || messages.english;
}

const AITutor = ({
  language = "english",
  initialInteractionMode = "text",
  messages = [],
  onLanguageChange = () => {},
}: AITutorProps) => {
  const [currentLanguage, setCurrentLanguage] = useState<
    "english" | "arabic" | "hindi"
  >(language);
  const [interactionMode, setInteractionMode] = useState<"text" | "voice">(
    initialInteractionMode,
  );
  const [inputText, setInputText] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>(
    messages.length > 0
      ? messages
      : [
          {
            id: "1",
            content: getWelcomeMessage(currentLanguage),
            sender: "ai",
            timestamp: new Date(),
            language: currentLanguage,
          },
        ],
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [queryCount, setQueryCount] = useState(0);
  const [dailyLimit] = useState(10);
  const [isPremium] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isRTL = currentLanguage === "arabic";

  // Voice interaction hook
  const {
    isListening,
    isSpeaking,
    transcript,
    error: voiceError,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    hasSpeechRecognitionSupport,
    hasSpeechSynthesisSupport,
  } = useVoiceInteraction({
    language: currentLanguage,
    onTranscript: (text) => {
      if (text.trim() && interactionMode === "voice") {
        handleVoiceMessage(text);
      }
    },
    onError: (error) => {
      toast({
        title: "Voice Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Update transcript display when listening
  useEffect(() => {
    if (isListening && transcript) {
      // Transcript is shown in the voice input area
    }
  }, [isListening, transcript]);

  const getLocalizedText = (key: string): string => {
    type TextKey =
      | "aiTutor"
      | "text"
      | "voice"
      | "listen"
      | "typePlaceholder"
      | "processing"
      | "aiResponse"
      | "voiceResponse"
      | "dailyLimit"
      | "upgradePrompt"
      | "queriesLeft"
      | "rateLimited"
      | "followUpQuestions"
      | "askQuestion"
      | "errorOccurred"
      | "noMicrophoneAccess";
    const texts: Record<
      "english" | "arabic" | "hindi",
      Record<TextKey, string>
    > = {
      english: {
        aiTutor: "AI Tutor",
        text: "Text",
        voice: "Voice",
        listen: "Listen",
        typePlaceholder: "Type your question here...",
        processing: "Processing...",
        aiResponse: "",
        voiceResponse: "",
        dailyLimit: "Daily limit reached",
        upgradePrompt: "Upgrade to Premium for unlimited queries",
        queriesLeft: "queries left today",
        rateLimited:
          "You've reached your daily limit. Please upgrade to Premium or try again tomorrow.",
        followUpQuestions: "Suggested Questions",
        askQuestion: "Ask this question",
        errorOccurred: "An error occurred. Please try again.",
        noMicrophoneAccess: "Microphone access is required for voice mode.",
      },
      arabic: {
        aiTutor: "المدرس الذكي",
        text: "نص",
        voice: "صوت",
        listen: "استمع",
        typePlaceholder: "اكتب سؤالك هنا...",
        processing: "جاري المعالجة...",
        aiResponse: "",
        voiceResponse: "",
        dailyLimit: "تم الوصول للحد اليومي",
        upgradePrompt: "ترقية إلى بريميوم للاستعلامات غير المحدودة",
        queriesLeft: "استعلامات متبقية اليوم",
        rateLimited:
          "لقد وصلت إلى حدك اليومي. يرجى الترقية إلى بريميوم أو المحاولة مرة أخرى غداً.",
        followUpQuestions: "الأسئلة المقترحة",
        askQuestion: "اطرح هذا السؤال",
        errorOccurred: "حدث خطأ. يرجى المحاولة مرة أخرى.",
        noMicrophoneAccess: "يتطلب الوضع الصوتي الوصول إلى الميكروفون.",
      },
      hindi: {
        aiTutor: "AI शिक्षक",
        text: "टेक्स्ट",
        voice: "आवाज़",
        listen: "सुनें",
        typePlaceholder: "यहाँ अपना प्रश्न टाइप करें...",
        processing: "प्रसंस्करण...",
        aiResponse: "",
        voiceResponse: "",
        dailyLimit: "दैनिक सीमा पहुंच गई",
        upgradePrompt: "असीमित प्रश्नों के लिए प्रीमियम में अपग्रेड करें",
        queriesLeft: "आज बचे प्रश्न",
        rateLimited:
          "आपने अपनी दैनिक सीमा पूरी कर ली है। कृपया प्रीमियम में अपग्रेड करें या कल फिर कोशिश करें।",
        followUpQuestions: "सुझाए गए प्रश्न",
        askQuestion: "यह प्रश्न पूछें",
        errorOccurred: "एक त्रुटि हुई। कृपया पुनः प्रयास करें।",
        noMicrophoneAccess: "वॉइस मोड के लिए माइक्रोफ़ोन एक्सेस आवश्यक है।",
      },
    };
    return texts[currentLanguage]?.[key as TextKey] || texts.english[key as TextKey];
  };

  const handleLanguageChange = (value: "english" | "arabic" | "hindi") => {
    setCurrentLanguage(value);
    onLanguageChange(value);
    // Stop any ongoing speech when language changes
    stopSpeaking();
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isProcessing) return;

    // Check rate limit
    if (!isPremium && queryCount >= dailyLimit) {
      toast({
        title: getLocalizedText("rateLimited"),
        description: getLocalizedText("upgradePrompt"),
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      sender: "user",
      timestamp: new Date(),
      language: currentLanguage,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsProcessing(true);

    try {
      // Format messages for API
      const apiMessages = formatMessagesForAPI([
        ...chatMessages.map((msg) => ({
          content: msg.content,
          sender: msg.sender,
        })),
        { content: inputText, sender: "user" },
      ]);

      // Call AI service
      const response = await sendMessageToTutor(apiMessages, currentLanguage);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.answer,
        sender: "ai",
        timestamp: new Date(),
        language: currentLanguage,
        followUpQuestions: response.followUpQuestions,
      };

      setChatMessages((prev) => [...prev, aiMessage]);
      setQueryCount((prev) => prev + 1);

      // Auto-speak AI response if in voice mode
      if (interactionMode === "voice" && hasSpeechSynthesisSupport) {
        await speak(response.answer, currentLanguage);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: getLocalizedText("errorOccurred"),
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceMessage = async (transcription: string) => {
    if (!transcription.trim() || isProcessing) return;

    // Check rate limit
    if (!isPremium && queryCount >= dailyLimit) {
      toast({
        title: getLocalizedText("rateLimited"),
        description: getLocalizedText("upgradePrompt"),
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: transcription,
      sender: "user",
      timestamp: new Date(),
      language: currentLanguage,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Format messages for API
      const apiMessages = formatMessagesForAPI([
        ...chatMessages.map((msg) => ({
          content: msg.content,
          sender: msg.sender,
        })),
        { content: transcription, sender: "user" },
      ]);

      // Call AI service
      const response = await sendMessageToTutor(apiMessages, currentLanguage);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.answer,
        sender: "ai",
        timestamp: new Date(),
        language: currentLanguage,
        followUpQuestions: response.followUpQuestions,
      };

      setChatMessages((prev) => [...prev, aiMessage]);
      setQueryCount((prev) => prev + 1);

      // Auto-speak AI response
      if (hasSpeechSynthesisSupport) {
        await speak(response.answer, currentLanguage);
      }
    } catch (error) {
      console.error("Error processing voice message:", error);
      toast({
        title: getLocalizedText("errorOccurred"),
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    setChatMessages([
      {
        id: Date.now().toString(),
        content: getWelcomeMessage(currentLanguage),
        sender: "ai",
        timestamp: new Date(),
        language: currentLanguage,
      },
    ]);
    setQueryCount(0);
    stopSpeaking();
    stopListening();
  };

  const handleFollowUpQuestion = (question: string) => {
    setInputText(question);
    // Auto-send the follow-up question
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleSpeakMessage = (text: string) => {
    if (hasSpeechSynthesisSupport) {
      speak(text, currentLanguage);
    } else {
      toast({
        title: "Not Supported",
        description: "Text-to-speech is not supported in your browser.",
        variant: "destructive",
      });
    }
  };

  const handleVoiceToggle = async () => {
    if (isListening) {
      stopListening();
    } else {
      if (!hasSpeechRecognitionSupport) {
        toast({
          title: "Not Supported",
          description: getLocalizedText("noMicrophoneAccess"),
          variant: "destructive",
        });
        return;
      }
      try {
        await startListening();
      } catch (error) {
        console.error("Error starting voice recognition:", error);
      }
    }
  };

  React.useEffect(() => {
    if (chatMessages.length === 1 && chatMessages[0].sender === "ai") {
      setChatMessages([
        {
          ...chatMessages[0],
          content: getWelcomeMessage(currentLanguage),
          language: currentLanguage,
        },
      ]);
    }
  }, [currentLanguage]);

  return (
    <Card className="w-full max-w-4xl mx-auto bg-background border shadow-lg">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            {getLocalizedText("aiTutor")}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Select
              value={currentLanguage}
              onValueChange={handleLanguageChange as (value: string) => void}
            >
              <SelectTrigger className="w-[130px]">
                <Languages className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="arabic">العربية</SelectItem>
                <SelectItem value="hindi">हिन्दी</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={clearConversation}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {!isPremium && (
          <div className="mt-2 text-sm text-muted-foreground">
            {dailyLimit - queryCount} {getLocalizedText("queriesLeft")}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <Tabs
          value={interactionMode}
          onValueChange={setInteractionMode as (value: string) => void}
          className="w-full"
        >
          <div className="border-b px-6 py-2">
            <TabsList className="grid w-full max-w-[400px] grid-cols-2">
              <TabsTrigger value="text">{getLocalizedText("text")}</TabsTrigger>
              <TabsTrigger value="voice">
                {getLocalizedText("voice")}
              </TabsTrigger>
            </TabsList>
          </div>

          <div
            className="h-[500px] overflow-y-auto p-6 scroll-smooth"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {chatMessages.map((message) => (
              <div key={message.id}>
                <div
                  className={`flex mb-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex items-start max-w-[80%]">
                    {message.sender === "ai" && (
                      <Avatar className={isRTL ? "ml-2" : "mr-2"}>
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=ai-tutor" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex-1">
                      <div
                        className={`rounded-lg p-3 slide-up ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground"
                            : "bg-gradient-to-r from-muted to-muted/80"
                        }`}
                        dir={isRTL && message.sender === "ai" ? "rtl" : "ltr"}
                        style={{
                          textAlign: isRTL && message.sender === "ai" ? "right" : "left",
                        }}
                      >
                        {message.content}
                      </div>
                      {message.sender === "ai" && (
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-primary/10"
                            onClick={() => handleSpeakMessage(message.content)}
                            disabled={isSpeaking}
                          >
                            {isSpeaking ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Volume2 className="h-4 w-4" />
                            )}
                            <span className="ml-1">{getLocalizedText("listen")}</span>
                          </Button>
                        </div>
                      )}
                      {message.sender === "ai" &&
                        message.followUpQuestions &&
                        message.followUpQuestions.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground">
                              {getLocalizedText("followUpQuestions")}:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {message.followUpQuestions.map((question, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="cursor-pointer hover:bg-primary/10 transition-colors"
                                  onClick={() => handleFollowUpQuestion(question)}
                                >
                                  {question}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                    {message.sender === "user" && (
                      <Avatar className={isRTL ? "mr-2" : "ml-2"}>
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                        <AvatarFallback>You</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start mb-4 slide-up">
                <div className="flex items-start max-w-[80%]">
                  <Avatar className={isRTL ? "ml-2" : "mr-2"}>
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=ai-tutor" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-gradient-to-r from-muted to-muted/80">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {getLocalizedText("processing")}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-4">
            <TabsContent value="text" className="mt-0">
              <div className="flex space-x-2">
                <Input
                  placeholder={getLocalizedText("typePlaceholder")}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  dir={isRTL ? "rtl" : "ltr"}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="voice" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant={isListening ? "destructive" : "default"}
                    size="lg"
                    onClick={handleVoiceToggle}
                    disabled={isProcessing || !hasSpeechRecognitionSupport}
                    className="rounded-full h-16 w-16"
                  >
                    {isListening ? (
                      <MicOff className="h-6 w-6" />
                    ) : (
                      <Mic className="h-6 w-6" />
                    )}
                  </Button>
                  <div className="flex-1">
                    {isListening && (
                      <div className="text-sm text-muted-foreground">
                        {transcript || "Listening..."}
                      </div>
                    )}
                    {!isListening && !hasSpeechRecognitionSupport && (
                      <p className="text-sm text-muted-foreground">
                        {getLocalizedText("noMicrophoneAccess")}
                      </p>
                    )}
                  </div>
                </div>
                {voiceError && (
                  <div className="text-sm text-destructive">{voiceError}</div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
      <FeedbackForm context="tutor" language={currentLanguage} compact />
    </Card>
  );
};

export default AITutor;

// AIProvider Context for managing AI state across components
export const AIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};
