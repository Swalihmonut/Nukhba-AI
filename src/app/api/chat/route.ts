import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

/**
 * API Route: /api/chat
 * Handles POST requests to chat with Nukhba AI tutor
 * 
 * Request body: { message: string }
 * Returns: { response: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { message } = body;

    // Validate input
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid request. 'message' field is required and must be a string." },
        { status: 400 }
      );
    }

    // Get API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("OPENAI_API_KEY is not configured");
      return NextResponse.json(
        { error: "OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables." },
        { status: 500 }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // System prompt for Nukhba AI tutor
    const systemPrompt = "You are Nukhba, a helpful Arabic language tutor. Correct grammar and keep responses concise.";

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    // Extract the AI's response
    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    // Return the response
    return NextResponse.json(
      { response: aiResponse },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/chat:", error);

    // Handle OpenAI-specific errors
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI API error: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

/**
 * Handle unsupported HTTP methods
 */
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to send a message." },
    { status: 405 }
  );
}

