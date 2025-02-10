import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your Vercel environment variables
});

export const runtime = "edge"; // Enable Edge Runtime for better performance

export async function GET() {
  try {
    const prompt = `
    You are a riddle generator. Create a riddle with three possible answers, one of which is correct.
    Try to make the riddle as interesting as possible, and unique every time.
    Generate a multiple-choice question. Provide a JSON response in the following format: 
    {
      "question": "",
      "choices": ["", "", ""],
      "correctIndex": 0
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
      temperature: 0.9,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;

    if (!content) {
      return NextResponse.json(
        { error: "Failed to generate question" },
        { status: 500 }
      );
    }

    const parsedResponse = JSON.parse(content);

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Failed to generate question" },
      { status: 500 }
    );
  }
}
