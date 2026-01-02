/**
 * Custom React Hook for Voice Interaction
 * Handles Speech-to-Text (Microphone Input) and Text-to-Speech (Audio Output)
 */

import { useState, useRef, useCallback, useEffect } from "react";

export type Language = "english" | "arabic" | "hindi";

interface UseVoiceInteractionOptions {
  language?: Language;
  onTranscript?: (text: string) => void;
  onError?: (error: Error) => void;
  autoStart?: boolean;
}

interface UseVoiceInteractionReturn {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  error: string | null;
  startListening: () => Promise<void>;
  stopListening: () => void;
  speak: (text: string, language?: Language) => Promise<void>;
  stopSpeaking: () => void;
  hasSpeechRecognitionSupport: boolean;
  hasSpeechSynthesisSupport: boolean;
}

/**
 * Maps our language codes to browser SpeechRecognition locales
 */
const SPEECH_RECOGNITION_LOCALES: Record<Language, string> = {
  english: "en-US",
  arabic: "ar-SA",
  hindi: "hi-IN",
};

/**
 * Maps our language codes to browser SpeechSynthesis locales
 */
const SPEECH_SYNTHESIS_LOCALES: Record<Language, string> = {
  english: "en-US",
  arabic: "ar-SA",
  hindi: "hi-IN",
};

/**
 * Custom hook for voice interaction (Speech-to-Text and Text-to-Speech)
 */
export function useVoiceInteraction(
  options: UseVoiceInteractionOptions = {}
): UseVoiceInteractionReturn {
  const {
    language = "english",
    onTranscript,
    onError,
    autoStart = false,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check for browser support
  const hasSpeechRecognitionSupport =
    typeof window !== "undefined" &&
    ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);

  const hasSpeechSynthesisSupport =
    typeof window !== "undefined" && "speechSynthesis" in window;

  /**
   * Initialize Speech Recognition
   */
  const initializeRecognition = useCallback(() => {
    if (!hasSpeechRecognitionSupport) {
      throw new Error(
        "Speech Recognition is not supported in this browser. Please use Chrome, Edge, or Safari."
      );
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!recognitionRef.current) {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = SPEECH_RECOGNITION_LOCALES[language];
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        setTranscript("");
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

        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript.trim());

        // Call onTranscript callback when we have final results
        if (finalTranscript && onTranscript) {
          onTranscript(finalTranscript.trim());
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        let errorMessage = "Speech recognition error occurred.";

        switch (event.error) {
          case "no-speech":
            errorMessage =
              language === "arabic"
                ? "لم يتم اكتشاف أي كلام. يرجى المحاولة مرة أخرى."
                : language === "hindi"
                ? "कोई भाषण नहीं मिला। कृपया पुनः प्रयास करें।"
                : "No speech detected. Please try again.";
            break;
          case "audio-capture":
            errorMessage =
              language === "arabic"
                ? "لا يمكن الوصول إلى الميكروفون. يرجى التحقق من الإعدادات."
                : language === "hindi"
                ? "माइक्रोफ़ोन तक पहुंच नहीं मिल सकी। कृपया सेटिंग्स जांचें।"
                : "Microphone access denied. Please check your settings.";
            break;
          case "not-allowed":
            errorMessage =
              language === "arabic"
                ? "تم رفض إذن الميكروفون. يرجى السماح بالوصول في إعدادات المتصفح."
                : language === "hindi"
                ? "माइक्रोफ़ोन अनुमति अस्वीकार कर दी गई। कृपया ब्राउज़र सेटिंग्स में अनुमति दें।"
                : "Microphone permission denied. Please allow access in browser settings.";
            break;
          case "network":
            errorMessage =
              language === "arabic"
                ? "خطأ في الشبكة. يرجى التحقق من اتصالك بالإنترنت."
                : language === "hindi"
                ? "नेटवर्क त्रुटि। कृपया अपने इंटरनेट कनेक्शन की जांच करें।"
                : "Network error. Please check your internet connection.";
            break;
          default:
            errorMessage =
              language === "arabic"
                ? `خطأ في التعرف على الصوت: ${event.error}`
                : language === "hindi"
                ? `भाषण पहचान त्रुटि: ${event.error}`
                : `Speech recognition error: ${event.error}`;
        }

        setError(errorMessage);
        setIsListening(false);

        if (onError) {
          onError(new Error(errorMessage));
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }

    // Update language when it changes
    const currentRecognition = recognitionRef.current;
    if (currentRecognition) {
      currentRecognition.lang = SPEECH_RECOGNITION_LOCALES[language];
    }
  }, [language, onTranscript, onError, hasSpeechRecognitionSupport]);

  /**
   * Start listening to microphone input
   */
  const startListening = useCallback(async () => {
    try {
      setError(null);
      setTranscript("");

      if (!hasSpeechRecognitionSupport) {
        throw new Error(
          "Speech Recognition is not supported in this browser."
        );
      }

      initializeRecognition();

      const currentRecognition = recognitionRef.current;
      if (currentRecognition && !isListening) {
        currentRecognition.start();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to start speech recognition.";
      setError(errorMessage);

      if (onError) {
        onError(err instanceof Error ? err : new Error(errorMessage));
      }
    }
  }, [hasSpeechRecognitionSupport, initializeRecognition, isListening, onError]);

  /**
   * Stop listening to microphone input
   */
  const stopListening = useCallback(() => {
    const currentRecognition = recognitionRef.current;
    if (currentRecognition && isListening) {
      currentRecognition.stop();
      setIsListening(false);
    }
  }, [isListening]);

  /**
   * Speak text using Text-to-Speech
   */
  const speak = useCallback(
    async (text: string, speakLanguage?: Language) => {
      if (!hasSpeechSynthesisSupport) {
        const errorMsg =
          "Text-to-Speech is not supported in this browser.";
        setError(errorMsg);
        if (onError) {
          onError(new Error(errorMsg));
        }
        return;
      }

      try {
        // Stop any ongoing speech
        stopSpeaking();

        synthesisRef.current = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        const targetLanguage = speakLanguage || language;

        utterance.lang = SPEECH_SYNTHESIS_LOCALES[targetLanguage];
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => {
          setIsSpeaking(true);
          setError(null);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          currentUtteranceRef.current = null;
        };

        utterance.onerror = (event) => {
          setIsSpeaking(false);
          const errorMsg =
            language === "arabic"
              ? "حدث خطأ في قراءة النص."
              : language === "hindi"
              ? "पाठ पढ़ने में त्रुटि हुई।"
              : "Error occurred while speaking text.";
          setError(errorMsg);

          if (onError) {
            onError(new Error(errorMsg));
          }
        };

        currentUtteranceRef.current = utterance;
        synthesisRef.current.speak(utterance);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to speak text.";
        setError(errorMessage);

        if (onError) {
          onError(err instanceof Error ? err : new Error(errorMessage));
        }
      }
    },
    [language, hasSpeechSynthesisSupport, onError]
  );

  /**
   * Stop speaking
   */
  const stopSpeaking = useCallback(() => {
    if (synthesisRef.current && isSpeaking) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
    }
  }, [isSpeaking]);

  // Update recognition language when language prop changes
  useEffect(() => {
    const currentRecognition = recognitionRef.current;
    if (currentRecognition && isListening) {
      currentRecognition.lang = SPEECH_RECOGNITION_LOCALES[language];
    }
  }, [language, isListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
      stopSpeaking();
    };
  }, [stopListening, stopSpeaking]);

  return {
    isListening,
    isSpeaking,
    transcript,
    error,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    hasSpeechRecognitionSupport,
    hasSpeechSynthesisSupport,
  };
}

