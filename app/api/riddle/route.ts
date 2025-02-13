import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your Vercel environment variables
});

export const runtime = "edge"; // Enable Edge Runtime for better performance

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const totalLevels = parseInt(searchParams.get('totalLevels') || '10');
    const attempt = parseInt(searchParams.get('attempt') || '0');

    const prompt = `
    You are a master riddle creator specializing in engaging and fun word puzzles. Create an original riddle that has never been used before.
    This is attempt ${attempt} for a game with ${totalLevels} total levels.
    
    Difficulty adjustment:
    - For attempts 0-${Math.floor(totalLevels * 2)}: Create simple, straightforward riddles using common objects and basic wordplay
    - For attempts ${Math.floor(totalLevels * 2) + 1}-${Math.floor(totalLevels * 4)}: Introduce gentle wordplay and mild misdirection
    - For attempts ${Math.floor(totalLevels * 4) + 1}+: Add moderate complexity with clever descriptions, but keep it solvable
    
    Focus on one of these accessible themes: everyday objects, simple nature elements, common activities, basic technology, or familiar places.
    The riddle should be fun and rewarding to solve, using clear hints and relatable concepts.
    
    Rules:
    - Keep the language clear and straightforward
    - Use familiar concepts that most people encounter regularly
    - Include gentle wordplay that guides rather than misleads
    - Make it enjoyable for all skill levels
    
    Generate a multiple-choice question. Provide a JSON response in the following format: 
    {
      "question": "",
      "choices": ["", "", ""],
      "correctIndex": 0,
      "level": ${attempt}
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
      temperature: 1.2,
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
