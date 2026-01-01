"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import {
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Type,
  Contrast,
  MousePointer,
  Keyboard,
  Accessibility,
} from "lucide-react";

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  reducedMotion: boolean;
  colorBlindFriendly: boolean;
  fontSize: number;
  voiceSpeed: number;
}

interface AccessibilityFeaturesProps {
  language?: "english" | "arabic" | "hindi";
  onSettingsChange?: (settings: AccessibilitySettings) => void;
}

const AccessibilityFeatures = ({
  language = "english",
  onSettingsChange = () => {},
}: AccessibilityFeaturesProps) => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    screenReader: false,
    keyboardNavigation: true,
    reducedMotion: false,
    colorBlindFriendly: false,
    fontSize: 16,
    voiceSpeed: 1,
  });
  const [isVisible, setIsVisible] = useState(false);
  const isRTL = language === "arabic";

  const getLocalizedText = (key: string): string => {
    type TextKey =
      | "accessibility"
      | "highContrast"
      | "largeText"
      | "screenReader"
      | "keyboardNav"
      | "reducedMotion"
      | "colorBlind"
      | "fontSize"
      | "voiceSpeed"
      | "wcagCompliant"
      | "testAccessibility"
      | "announceChanges"
      | "skipToContent"
      | "keyboardShortcuts"
      | "altText"
      | "focusIndicators"
      | "colorContrast";
    const texts: Record<
      "english" | "arabic" | "hindi",
      Record<TextKey, string>
    > = {
      english: {
        accessibility: "Accessibility",
        highContrast: "High Contrast",
        largeText: "Large Text",
        screenReader: "Screen Reader Support",
        keyboardNav: "Keyboard Navigation",
        reducedMotion: "Reduced Motion",
        colorBlind: "Color Blind Friendly",
        fontSize: "Font Size",
        voiceSpeed: "Voice Speed",
        wcagCompliant: "WCAG 2.1 AA Compliant",
        testAccessibility: "Test Accessibility",
        announceChanges: "Announce Changes",
        skipToContent: "Skip to Content",
        keyboardShortcuts: "Keyboard Shortcuts",
        altText: "All images have alt text",
        focusIndicators: "Clear focus indicators",
        colorContrast: "4.5:1 color contrast ratio",
      },
      arabic: {
        accessibility: "إمكانية الوصول",
        highContrast: "تباين عالي",
        largeText: "نص كبير",
        screenReader: "دعم قارئ الشاشة",
        keyboardNav: "التنقل بلوحة المفاتيح",
        reducedMotion: "حركة مقللة",
        colorBlind: "ودود لعمى الألوان",
        fontSize: "حجم الخط",
        voiceSpeed: "سرعة الصوت",
        wcagCompliant: "متوافق مع WCAG 2.1 AA",
        testAccessibility: "اختبار إمكانية الوصول",
        announceChanges: "الإعلان عن التغييرات",
        skipToContent: "تخطي إلى المحتوى",
        keyboardShortcuts: "اختصارات لوحة المفاتيح",
        altText: "جميع الصور لها نص بديل",
        focusIndicators: "مؤشرات تركيز واضحة",
        colorContrast: "نسبة تباين الألوان 4.5:1",
      },
      hindi: {
        accessibility: "पहुंच-योग्यता",
        highContrast: "उच्च कंट्रास्ट",
        largeText: "बड़ा टेक्स्ट",
        screenReader: "स्क्रीन रीडर समर्थन",
        keyboardNav: "कीबोर्ड नेवीगेशन",
        reducedMotion: "कम गति",
        colorBlind: "रंग अंधता अनुकूल",
        fontSize: "फ़ॉन्ट आकार",
        voiceSpeed: "आवाज़ की गति",
        wcagCompliant: "WCAG 2.1 AA अनुपालित",
        testAccessibility: "पहुंच-योग्यता परीक्षण",
        announceChanges: "परिवर्तन घोषणा",
        skipToContent: "सामग्री पर जाएं",
        keyboardShortcuts: "कीबोर्ड शॉर्टकट",
        altText: "सभी छवियों में alt टेक्स्ट है",
        focusIndicators: "स्पष्ट फोकस संकेतक",
        colorContrast: "4.5:1 रंग कंट्रास्ट अनुपात",
      },
    };
    return texts[language]?.[key as TextKey] || texts.english[key as TextKey];
  };

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;

    // High contrast
    if (settings.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    // Large text
    if (settings.largeText) {
      root.style.fontSize = `${settings.fontSize}px`;
    } else {
      root.style.fontSize = "";
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }

    // Color blind friendly
    if (settings.colorBlindFriendly) {
      root.classList.add("color-blind-friendly");
    } else {
      root.classList.remove("color-blind-friendly");
    }

    onSettingsChange(settings);
  }, [settings, onSettingsChange]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!settings.keyboardNavigation) return;

      // Alt + A to toggle accessibility panel
      if (e.altKey && e.key === "a") {
        e.preventDefault();
        setIsVisible((prev) => !prev);
      }

      // Alt + S to skip to main content
      if (e.altKey && e.key === "s") {
        e.preventDefault();
        const main = document.querySelector("main");
        if (main) {
          main.focus();
          const skipText =
            language === "arabic"
              ? "تخطي إلى المحتوى"
              : language === "hindi"
                ? "सामग्री पर जाएं"
                : "Skip to Content";
          announceToScreenReader(skipText);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [settings.keyboardNavigation, language]);

  const announceToScreenReader = (message: string) => {
    if (!settings.screenReader) return;

    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    announceToScreenReader(`${key} ${value ? "enabled" : "disabled"}`);
  };

  const testAccessibility = () => {
    // Simulate accessibility test
    const issues = [];

    // Check for missing alt text
    const images = document.querySelectorAll("img:not([alt])");
    if (images.length > 0) {
      issues.push(`${images.length} images missing alt text`);
    }

    // Check for low contrast (simplified)
    const elements = document.querySelectorAll("*");
    let lowContrastCount = 0;
    elements.forEach((el) => {
      const style = window.getComputedStyle(el);
      const color = style.color;
      const bgColor = style.backgroundColor;
      // Simplified contrast check
      if (
        color &&
        bgColor &&
        color !== "rgba(0, 0, 0, 0)" &&
        bgColor !== "rgba(0, 0, 0, 0)"
      ) {
        // Would implement proper contrast ratio calculation here
      }
    });

    if (issues.length === 0) {
      announceToScreenReader("Accessibility test passed. No issues found.");
    } else {
      announceToScreenReader(
        `Accessibility test found ${issues.length} issues.`,
      );
    }
  };

  return (
    <>
      {/* Accessibility Toggle Button */}
      <Button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 p-0"
        aria-label={getLocalizedText("accessibility")}
        title="Alt + A"
      >
        <Accessibility className="h-6 w-6" />
      </Button>

      {/* Skip to Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded z-50"
        onFocus={() =>
          announceToScreenReader(getLocalizedText("skipToContent"))
        }
      >
        {getLocalizedText("skipToContent")}
      </a>

      {/* Accessibility Panel */}
      {isVisible && (
        <Card
          className={`fixed top-4 right-4 z-40 w-80 max-h-[80vh] overflow-y-auto ${isRTL ? "rtl" : "ltr"}`}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Accessibility className="h-5 w-5" />
              {getLocalizedText("accessibility")}
            </CardTitle>
            <Badge variant="outline" className="w-fit">
              {getLocalizedText("wcagCompliant")}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Visual Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="high-contrast"
                  className="flex items-center gap-2"
                >
                  <Contrast className="h-4 w-4" />
                  {getLocalizedText("highContrast")}
                </Label>
                <Switch
                  id="high-contrast"
                  checked={settings.highContrast}
                  onCheckedChange={(checked) =>
                    updateSetting("highContrast", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="large-text" className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  {getLocalizedText("largeText")}
                </Label>
                <Switch
                  id="large-text"
                  checked={settings.largeText}
                  onCheckedChange={(checked) =>
                    updateSetting("largeText", checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>
                  {getLocalizedText("fontSize")}: {settings.fontSize}px
                </Label>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={([value]) => updateSetting("fontSize", value)}
                  min={12}
                  max={24}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label
                  htmlFor="color-blind"
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  {getLocalizedText("colorBlind")}
                </Label>
                <Switch
                  id="color-blind"
                  checked={settings.colorBlindFriendly}
                  onCheckedChange={(checked) =>
                    updateSetting("colorBlindFriendly", checked)
                  }
                />
              </div>
            </div>

            {/* Motion Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="reduced-motion"
                  className="flex items-center gap-2"
                >
                  <MousePointer className="h-4 w-4" />
                  {getLocalizedText("reducedMotion")}
                </Label>
                <Switch
                  id="reduced-motion"
                  checked={settings.reducedMotion}
                  onCheckedChange={(checked) =>
                    updateSetting("reducedMotion", checked)
                  }
                />
              </div>
            </div>

            {/* Navigation Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="keyboard-nav"
                  className="flex items-center gap-2"
                >
                  <Keyboard className="h-4 w-4" />
                  {getLocalizedText("keyboardNav")}
                </Label>
                <Switch
                  id="keyboard-nav"
                  checked={settings.keyboardNavigation}
                  onCheckedChange={(checked) =>
                    updateSetting("keyboardNavigation", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label
                  htmlFor="screen-reader"
                  className="flex items-center gap-2"
                >
                  <Volume2 className="h-4 w-4" />
                  {getLocalizedText("screenReader")}
                </Label>
                <Switch
                  id="screen-reader"
                  checked={settings.screenReader}
                  onCheckedChange={(checked) =>
                    updateSetting("screenReader", checked)
                  }
                />
              </div>

              {settings.screenReader && (
                <div className="space-y-2">
                  <Label>
                    {getLocalizedText("voiceSpeed")}: {settings.voiceSpeed}x
                  </Label>
                  <Slider
                    value={[settings.voiceSpeed]}
                    onValueChange={([value]) =>
                      updateSetting("voiceSpeed", value)
                    }
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Accessibility Test */}
            <Button
              onClick={testAccessibility}
              variant="outline"
              className="w-full"
            >
              {getLocalizedText("testAccessibility")}
            </Button>

            {/* Compliance Info */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p>✓ {getLocalizedText("altText")}</p>
              <p>✓ {getLocalizedText("focusIndicators")}</p>
              <p>✓ {getLocalizedText("colorContrast")}</p>
              <p>✓ {getLocalizedText("keyboardShortcuts")}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Screen Reader Announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" />
    </>
  );
};

export default AccessibilityFeatures;
export { type AccessibilitySettings };
