/**
 * AI Tutor Service
 * Handles communication with OpenAI API for exam preparation tutoring
 */

export interface TutorMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface TutorResponse {
  answer: string;
  followUpQuestions: string[];
  explanation?: string;
}

/**
 * System prompts for different languages
 */
const SYSTEM_PROMPTS = {
  english: `You are a friendly and patient exam preparation tutor. Your role is to help students prepare for competitive exams like UGC NET, Kerala PSC, and other government exams.

Guidelines:
- Speak in simple, clear English
- Break down complex topics into easy-to-understand explanations
- Provide practical examples relevant to exam preparation
- Always separate your response into:
  1. A clear, concise answer to the student's question
  2. 2-3 suggested follow-up questions that would help deepen their understanding

Format your response as JSON:
{
  "answer": "Your main answer here",
  "followUpQuestions": ["Question 1", "Question 2", "Question 3"],
  "explanation": "Optional additional explanation if needed"
}

Be encouraging and supportive. If the student asks about exam strategies, study tips, or specific topics, provide actionable advice.`,

  arabic: `أنت مدرس ودود وصبور للتحضير للامتحانات. دورك هو مساعدة الطلاب في التحضير للامتحانات التنافسية مثل UGC NET وامتحانات الخدمة المدنية.

الإرشادات:
- تحدث بالعربية البسيطة والواضحة
- قسّم المواضيع المعقدة إلى تفسيرات سهلة الفهم
- قدم أمثلة عملية ذات صلة بالتحضير للامتحان
- افصل دائماً ردك إلى:
  1. إجابة واضحة وموجزة على سؤال الطالب
  2. 2-3 أسئلة متابعة مقترحة تساعد في تعميق فهمهم

قم بتنسيق ردك كـ JSON:
{
  "answer": "إجابتك الرئيسية هنا",
  "followUpQuestions": ["السؤال 1", "السؤال 2", "السؤال 3"],
  "explanation": "شرح إضافي اختياري إذا لزم الأمر"
}

كن مشجعاً وداعماً. إذا سأل الطالب عن استراتيجيات الامتحان أو نصائح الدراسة أو مواضيع محددة، قدم نصيحة قابلة للتنفيذ.`,

  hindi: `आप एक मित्रतापूर्ण और धैर्यवान परीक्षा तैयारी शिक्षक हैं। आपकी भूमिका UGC NET, केरल PSC और अन्य सरकारी परीक्षाओं जैसी प्रतियोगी परीक्षाओं की तैयारी में छात्रों की मदद करना है।

दिशानिर्देश:
- सरल, स्पष्ट हिंदी में बोलें
- जटिल विषयों को समझने में आसान स्पष्टीकरण में तोड़ें
- परीक्षा तैयारी से प्रासंगिक व्यावहारिक उदाहरण प्रदान करें
- हमेशा अपने उत्तर को अलग करें:
  1. छात्र के प्रश्न का स्पष्ट, संक्षिप्त उत्तर
  2. 2-3 सुझाए गए अनुवर्ती प्रश्न जो उनकी समझ को गहरा करने में मदद करेंगे

अपने उत्तर को JSON के रूप में प्रारूपित करें:
{
  "answer": "आपका मुख्य उत्तर यहाँ",
  "followUpQuestions": ["प्रश्न 1", "प्रश्न 2", "प्रश्न 3"],
  "explanation": "यदि आवश्यक हो तो वैकल्पिक अतिरिक्त स्पष्टीकरण"
}

प्रोत्साहन और सहायक बनें। यदि छात्र परीक्षा रणनीतियों, अध्ययन युक्तियों, या विशिष्ट विषयों के बारे में पूछता है, तो कार्रवाई योग्य सलाह प्रदान करें।`,
};

/**
 * Sends a message to the AI tutor and returns a structured response
 * @param messages - Array of conversation messages
 * @param language - User's selected language
 * @returns Structured tutor response with answer and follow-up questions
 */
export async function sendMessageToTutor(
  messages: TutorMessage[],
  language: "english" | "arabic" | "hindi" = "english"
): Promise<TutorResponse> {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OpenAI API key is not configured. Please set NEXT_PUBLIC_OPENAI_API_KEY in your environment variables."
    );
  }

  // Prepare messages with system prompt
  const systemPrompt: TutorMessage = {
    role: "system",
    content: SYSTEM_PROMPTS[language],
  };

  const conversationMessages = [systemPrompt, ...messages];

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // Using gpt-4o, fallback to gpt-3.5-turbo if needed
        messages: conversationMessages,
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" }, // Request JSON response
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message ||
          `OpenAI API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error("No response from OpenAI API");
    }

    // Parse JSON response
    try {
      const parsedResponse: TutorResponse = JSON.parse(assistantMessage);
      
      // Validate response structure
      if (!parsedResponse.answer) {
        throw new Error("Invalid response format: missing 'answer' field");
      }

      // Ensure followUpQuestions is an array
      if (!Array.isArray(parsedResponse.followUpQuestions)) {
        parsedResponse.followUpQuestions = [];
      }

      return parsedResponse;
    } catch (parseError) {
      // If JSON parsing fails, treat the entire response as the answer
      console.warn("Failed to parse JSON response, using raw text:", parseError);
      return {
        answer: assistantMessage,
        followUpQuestions: [],
        explanation: undefined,
      };
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    
    // Return a user-friendly error message
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        throw new Error(
          language === "arabic"
            ? "مفتاح API غير مُكوّن. يرجى التحقق من إعدادات البيئة."
            : language === "hindi"
            ? "API कुंजी कॉन्फ़िगर नहीं है। कृपया पर्यावरण सेटिंग्स जांचें।"
            : "API key not configured. Please check your environment settings."
        );
      }
      throw error;
    }
    
    throw new Error(
      language === "arabic"
        ? "حدث خطأ في الاتصال بخدمة الذكاء الاصطناعي. يرجى المحاولة مرة أخرى."
        : language === "hindi"
        ? "AI सेवा से कनेक्ट करने में त्रुटि हुई। कृपया पुनः प्रयास करें।"
        : "Failed to connect to AI service. Please try again."
    );
  }
}

/**
 * Converts chat messages to OpenAI format
 */
export function formatMessagesForAPI(
  messages: Array<{ content: string; sender: "user" | "ai" }>
): TutorMessage[] {
  return messages.map((msg) => ({
    role: msg.sender === "user" ? "user" : "assistant",
    content: msg.content,
  }));
}

