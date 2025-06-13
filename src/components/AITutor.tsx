"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Mic, Send, Volume2, Languages, RotateCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import VoiceInteraction from "./VoiceInteraction";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  language: "english" | "arabic";
}

interface AITutorProps {
  initialLanguage?: "english" | "arabic";
  initialInteractionMode?: "text" | "voice";
  messages?: Message[];
}

const AITutor = ({
  initialLanguage = "english",
  initialInteractionMode = "text",
  messages = [],
}: AITutorProps) => {
  const [language, setLanguage] = useState<"english" | "arabic">(
    initialLanguage,
  );
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
            content:
              language === "english"
                ? "Hello! I'm your AI tutor. How can I help you with your exam preparation today?"
                : "مرحبًا! أنا مدرسك الذكي. كيف يمكنني مساعدتك في التحضير للامتحان اليوم؟",
            sender: "ai",
            timestamp: new Date(),
            language: language,
          },
        ],
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLanguageChange = (value: "english" | "arabic") => {
    setLanguage(value);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      sender: "user",
      timestamp: new Date(),
      language: language,
    };

    setChatMessages([...chatMessages, userMessage]);
    setInputText("");
    setIsProcessing(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          language === "english"
            ? "I understand your question. Here's what you need to know about this topic for your exam preparation..."
            : "أفهم سؤالك. إليك ما تحتاج إلى معرفته حول هذا الموضوع للتحضير للامتحان...",
        sender: "ai",
        timestamp: new Date(),
        language: language,
      };

      setChatMessages((prevMessages) => [...prevMessages, aiResponse]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleVoiceMessage = (transcription: string) => {
    if (!transcription.trim()) return;

    // Add user voice message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: transcription,
      sender: "user",
      timestamp: new Date(),
      language: language,
    };

    setChatMessages([...chatMessages, userMessage]);
    setIsProcessing(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          language === "english"
            ? "I heard your question. Here's my response to help with your exam preparation..."
            : "سمعت سؤالك. إليك ردي للمساعدة في التحضير للامتحان...",
        sender: "ai",
        timestamp: new Date(),
        language: language,
      };

      setChatMessages((prevMessages) => [...prevMessages, aiResponse]);
      setIsProcessing(false);
    }, 1500);
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
        content:
          language === "english"
            ? "Hello! I'm your AI tutor. How can I help you with your exam preparation today?"
            : "مرحبًا! أنا مدرسك الذكي. كيف يمكنني مساعدتك في التحضير للامتحان اليوم؟",
        sender: "ai",
        timestamp: new Date(),
        language: language,
      },
    ]);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-background border shadow-lg">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            {language === "english" ? "AI Tutor" : "المدرس الذكي"}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Select
              value={language}
              onValueChange={handleLanguageChange as (value: string) => void}
            >
              <SelectTrigger className="w-[130px]">
                <Languages className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="arabic">العربية</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={clearConversation}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs
          value={interactionMode}
          onValueChange={setInteractionMode as (value: string) => void}
          className="w-full"
        >
          <div className="border-b px-6 py-2">
            <TabsList className="grid w-full max-w-[400px] grid-cols-2">
              <TabsTrigger value="text">
                {language === "english" ? "Text" : "نص"}
              </TabsTrigger>
              <TabsTrigger value="voice">
                {language === "english" ? "Voice" : "صوت"}
              </TabsTrigger>
            </TabsList>
          </div>

          <div
            className="h-[500px] overflow-y-auto p-6"
            dir={language === "arabic" ? "rtl" : "ltr"}
          >
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex mb-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="flex items-start max-w-[80%]">
                  {message.sender === "ai" && (
                    <Avatar className="mr-2">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=ai-tutor" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.sender === "ai" && (
                      <Button variant="ghost" size="sm" className="mt-1">
                        <Volume2 className="h-4 w-4 mr-1" />
                        {language === "english" ? "Listen" : "استمع"}
                      </Button>
                    )}
                  </div>
                  {message.sender === "user" && (
                    <Avatar className="ml-2">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start mb-4">
                <div className="flex items-start max-w-[80%]">
                  <Avatar className="mr-2">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=ai-tutor" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-muted">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t p-4">
            <TabsContent value="text" className="mt-0">
              <div className="flex space-x-2">
                <Input
                  placeholder={
                    language === "english"
                      ? "Type your question here..."
                      : "اكتب سؤالك هنا..."
                  }
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1"
                  dir={language === "arabic" ? "rtl" : "ltr"}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isProcessing}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="voice" className="mt-0">
              <VoiceInteraction
                language={language}
                onTranscriptionComplete={handleVoiceMessage}
                isProcessing={isProcessing}
              />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AITutor;
