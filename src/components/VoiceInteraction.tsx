"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Mic, MicOff, Play, Square, Volume2, Languages } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface VoiceInteractionProps {
  onTranscript?: (transcript: string) => void;
  onLanguageChange?: (language: "english" | "arabic" | "hindi") => void;
  isListening?: boolean;
  aiResponseAudio?: string;
  language?: "english" | "arabic" | "hindi";
  onAIResponse?: (response: string) => void;
}

const VoiceInteraction = ({
  onTranscript = () => {},
  onLanguageChange = () => {},
  isListening = false,
  aiResponseAudio = "",
  language = "english",
  onAIResponse = () => {},
}: VoiceInteractionProps) => {
  const isRTL = language === "arabic";

  const getLocalizedText = (key: string): string => {
    type TextKey =
      | "recording"
      | "tapToSpeak"
      | "holdToSpeak"
      | "autoPlay"
      | "language"
      | "error"
      | "processing"
      | "micPermissionError"
      | "networkError";
    const texts: Record<
      "english" | "arabic" | "hindi",
      Record<TextKey, string>
    > = {
      english: {
        recording: "Recording...",
        tapToSpeak: "Tap to speak",
        holdToSpeak: "Hold to speak",
        autoPlay: "Auto-play responses",
        language: "Language",
        error: "Error: Please check microphone permissions",
        processing: "Processing...",
        micPermissionError: "Microphone permission denied. Please allow access in browser settings.",
        networkError: "Network error. Please check your connection.",
      },
      arabic: {
        recording: "جاري التسجيل...",
        tapToSpeak: "اضغط للتحدث",
        holdToSpeak: "اضغط مع الاستمرار للتحدث",
        autoPlay: "تشغيل تلقائي للردود",
        language: "اللغة",
        error: "خطأ: يرجى التحقق من أذونات الميكروفون",
        processing: "جاري المعالجة...",
        micPermissionError: "تم رفض إذن الميكروفون. يرجى السماح بالوصول في إعدادات المتصفح.",
        networkError: "خطأ في الشبكة. يرجى التحقق من اتصالك.",
      },
      hindi: {
        recording: "रिकॉर्डिंग...",
        tapToSpeak: "बोलने के लिए टैप करें",
        holdToSpeak: "बोलने के लिए दबाए रखें",
        autoPlay: "स्वचालित उत्तर प्लेबैक",
        language: "भाषा",
        error: "त्रुटि: कृपया माइक्रोफ़ोन अनुमतियाँ जांचें",
        processing: "प्रसंस्करण...",
        micPermissionError: "माइक्रोफ़ोन अनुमति अस्वीकार कर दी गई। कृपया ब्राउज़र सेटिंग्स में अनुमति दें।",
        networkError: "नेटवर्क त्रुटि। कृपया अपने कनेक्शन की जांच करें।",
      },
    };
    return texts[language]?.[key as TextKey] || texts.english[key as TextKey];
  };
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [autoPlay, setAutoPlay] = useState(true);
  const [visualizerData, setVisualizerData] = useState<number[]>(
    Array(20).fill(5),
  );
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef<string>("");
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  // Function to speak text using speechSynthesis with Arabic voice
  const speakText = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    try {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();

      synthesisRef.current = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);

      // Set language based on current language (prioritize Arabic)
      if (language === "arabic") {
        utterance.lang = "ar-SA";
        // Try to find an Arabic voice
        const voices = window.speechSynthesis.getVoices();
        const arabicVoice = voices.find(
          (voice) => voice.lang.startsWith("ar") || voice.name.toLowerCase().includes("arabic")
        );
        if (arabicVoice) {
          utterance.voice = arabicVoice;
        }
      } else if (language === "hindi") {
        utterance.lang = "hi-IN";
        const voices = window.speechSynthesis.getVoices();
        const hindiVoice = voices.find(
          (voice) => voice.lang.startsWith("hi") || voice.name.toLowerCase().includes("hindi")
        );
        if (hindiVoice) {
          utterance.voice = hindiVoice;
        }
      } else {
        utterance.lang = "en-US";
      }

      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = volume[0] / 100;

      synthesisRef.current.speak(utterance);
    } catch (error) {
      console.error("Error speaking text:", error);
    }
  }, [language, volume]);

  // Function to send transcript to API and get AI response
  const handleSendToAPI = useCallback(async (transcriptText: string) => {
    if (!transcriptText.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: transcriptText }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponseText = data.response || "";

      if (aiResponseText) {
        setAiResponse(aiResponseText);
        onAIResponse(aiResponseText);

        // Speak the AI response using speechSynthesis in Arabic voice
        if (autoPlay && typeof window !== "undefined" && "speechSynthesis" in window) {
          speakText(aiResponseText);
        }
      }
    } catch (error) {
      console.error("Error calling /api/chat:", error);
      const errorMsg = error instanceof Error 
        ? error.message 
        : getLocalizedText("networkError");
      setError(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  }, [autoPlay, onAIResponse, speakText, getLocalizedText]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(getLocalizedText("error"));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language === "arabic" ? "ar-SA" : language === "hindi" ? "hi-IN" : "en-US";

    recognition.onstart = () => {
      setIsRecording(true);
      setError(null);
      setTranscript("");
      finalTranscriptRef.current = "";
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      finalTranscriptRef.current += finalTranscript;
      const fullTranscript = finalTranscriptRef.current || interimTranscript;
      setTranscript(fullTranscript.trim());
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
      
      // Enhanced error handling with try/catch
      try {
        let errorMessage = getLocalizedText("error");
        
        switch (event.error) {
          case "not-allowed":
          case "permission-denied":
            errorMessage = getLocalizedText("micPermissionError");
            break;
          case "no-speech":
            // Don't show error for no-speech, just stop recording
            return;
          case "network":
            errorMessage = getLocalizedText("networkError");
            break;
          case "audio-capture":
            errorMessage = getLocalizedText("micPermissionError");
            break;
          default:
            errorMessage = `${getLocalizedText("error")}: ${event.error}`;
        }
        
        setError(errorMessage);
      } catch (err) {
        console.error("Error handling speech recognition error:", err);
        setError(getLocalizedText("error"));
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
      // Send final transcript when recognition ends
      if (finalTranscriptRef.current.trim()) {
        const finalText = finalTranscriptRef.current.trim();
        onTranscript(finalText);
        // Send to API and get AI response
        handleSendToAPI(finalText);
        finalTranscriptRef.current = "";
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, handleSendToAPI, onTranscript]);

  // Update recognition language when language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language === "arabic" ? "ar-SA" : language === "hindi" ? "hi-IN" : "en-US";
    }
  }, [language]);

  // Voice visualization when recording
  useEffect(() => {
    if (isRecording) {
      const updateVisualizer = () => {
        const newData = visualizerData.map(
          () => Math.floor(Math.random() * 40) + 5,
        );
        setVisualizerData(newData);
        animationFrameRef.current = requestAnimationFrame(updateVisualizer);
      };
      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      setVisualizerData(Array(20).fill(5));
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording, visualizerData]);

  // Handle audio playback
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  // Auto-play AI response when received
  useEffect(() => {
    if (aiResponseAudio && autoPlay && audioRef.current) {
      audioRef.current.src = aiResponseAudio;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
        });
    }
  }, [aiResponseAudio, autoPlay]);

  // Function to send transcript to API and get AI response
  const handleSendToAPI = async (transcriptText: string) => {
    if (!transcriptText.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: transcriptText }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponseText = data.response || "";

      if (aiResponseText) {
        setAiResponse(aiResponseText);
        onAIResponse(aiResponseText);

        // Speak the AI response using speechSynthesis in Arabic voice
        if (autoPlay && typeof window !== "undefined" && "speechSynthesis" in window) {
          speakText(aiResponseText);
        }
      }
    } catch (error) {
      console.error("Error calling /api/chat:", error);
      const errorMsg = error instanceof Error 
        ? error.message 
        : getLocalizedText("networkError");
      setError(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to speak text using speechSynthesis with Arabic voice
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    try {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();

      synthesisRef.current = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);

      // Set language based on current language (prioritize Arabic)
      if (language === "arabic") {
        utterance.lang = "ar-SA";
        // Try to find an Arabic voice
        const voices = window.speechSynthesis.getVoices();
        const arabicVoice = voices.find(
          (voice) => voice.lang.startsWith("ar") || voice.name.toLowerCase().includes("arabic")
        );
        if (arabicVoice) {
          utterance.voice = arabicVoice;
        }
      } else if (language === "hindi") {
        utterance.lang = "hi-IN";
        const voices = window.speechSynthesis.getVoices();
        const hindiVoice = voices.find(
          (voice) => voice.lang.startsWith("hi") || voice.name.toLowerCase().includes("hindi")
        );
        if (hindiVoice) {
          utterance.voice = hindiVoice;
        }
      } else {
        utterance.lang = "en-US";
      }

      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = volume[0] / 100;

      synthesisRef.current.speak(utterance);
    } catch (error) {
      console.error("Error speaking text:", error);
    }
  };

  // Load voices when component mounts
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      // Some browsers need voices to be loaded
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const handleStartRecording = () => {
    if (recognitionRef.current && !isRecording && !isProcessing) {
      try {
        setError(null);
        recognitionRef.current.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setError(getLocalizedText("micPermissionError"));
      }
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  const handleRecordToggle = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const handlePlayToggle = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <Card
      className={`w-full p-4 bg-background border rounded-xl shadow-sm ${isRTL ? "rtl" : "ltr"}`}
    >
      <div className="flex flex-col space-y-4">
        {/* Voice Visualizer */}
        <div className="flex items-center justify-center h-16 bg-gradient-to-r from-muted/20 to-muted/40 rounded-lg overflow-hidden">
          <div className="flex items-end h-full space-x-1 px-2">
            {visualizerData.map((height, index) => (
              <div
                key={index}
                className={`w-1.5 rounded-t-sm transition-all duration-200 ${
                  isRecording
                    ? "bg-gradient-to-t from-primary to-primary/60 voice-bar"
                    : "bg-muted"
                }`}
                style={{
                  height: `${height}%`,
                  animationDelay: `${index * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-sm text-destructive mb-2 p-2 bg-destructive/10 rounded">
            {error}
          </div>
        )}

        {/* Live Transcript */}
        {transcript && (
          <div className="text-sm text-muted-foreground mb-2 p-2 bg-muted/50 rounded">
            <strong>{language === "arabic" ? "أنت تقول:" : language === "hindi" ? "आप कह रहे हैं:" : "You said:"}</strong> {transcript}
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="text-sm text-primary mb-2 p-2 bg-primary/10 rounded flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {getLocalizedText("processing")}
          </div>
        )}

        {/* AI Response */}
        {aiResponse && !isProcessing && (
          <div className="text-sm text-foreground mb-2 p-2 bg-primary/10 rounded">
            <strong>{language === "arabic" ? "نخبة:" : language === "hindi" ? "नुखबा:" : "Nukhba:"}</strong> {aiResponse}
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={isRecording ? "destructive" : "default"}
              size="icon"
              onMouseDown={handleStartRecording}
              onMouseUp={handleStopRecording}
              onTouchStart={handleStartRecording}
              onTouchEnd={handleStopRecording}
              onClick={handleRecordToggle}
              className="rounded-full h-12 w-12"
            >
              {isRecording ? (
                <Square className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </Button>
            <div className="text-sm font-medium">
              {isRecording
                ? getLocalizedText("recording")
                : getLocalizedText("holdToSpeak")}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePlayToggle}
              disabled={!aiResponseAudio}
              className="rounded-full h-10 w-10"
            >
              {isPlaying ? (
                <Square className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <div className="flex items-center space-x-2 w-32">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Language and Settings */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t">
          <div className="flex items-center space-x-2">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <Select
              value={language}
              onValueChange={(value) => onLanguageChange(value as "english" | "arabic" | "hindi")}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="arabic">العربية</SelectItem>
                <SelectItem value="hindi">हिन्दी</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="auto-play"
              checked={autoPlay}
              onCheckedChange={setAutoPlay}
            />
            <Label htmlFor="auto-play" className="text-sm">
              {getLocalizedText("autoPlay")}
            </Label>
          </div>
        </div>
      </div>

      {/* Hidden audio element for playback */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        style={{ display: "none" }}
      />
    </Card>
  );
};

export default VoiceInteraction;
