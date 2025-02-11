import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your Vercel environment variables
});

export const runtime = "edge"; // Enable Edge Runtime for better performance

export async function GET(request: Request) {
  try {
    // Get parameters from URL
    const { searchParams } = new URL(request.url);
    const currentLevel = parseInt(searchParams.get('level') || '1');
    const totalLevels = parseInt(searchParams.get('totalLevels') || '10');

    const prompt = `
    You are a master riddle creator specializing in clever and unique word puzzles. Create an original riddle that has never been used before.
    This is level ${currentLevel} out of ${totalLevels} total levels.
    
    Difficulty adjustment:
    - For levels 1-${Math.floor(totalLevels * 0.3)}: Focus on straightforward wordplay and common objects
    - For levels ${Math.floor(totalLevels * 0.3) + 1}-${Math.floor(totalLevels * 0.7)}: Introduce more complex metaphors and abstract concepts
    - For levels ${Math.floor(totalLevels * 0.7) + 1}-${totalLevels}: Create challenging riddles with multiple layers of meaning
    
    Focus on one of these random themes: nature, technology, everyday objects, abstract concepts, historical figures, or modern life.
    Make sure the riddle is challenging but solvable, using wordplay, metaphors, or clever descriptions.
    
    Rules:
    - Avoid common riddle patterns and clichés
    - Make it age-appropriate for teenagers and adults
    - Use fresh and unexpected perspectives
    - Include subtle misdirection while keeping it fair
    
    Generate a multiple-choice question. Provide a JSON response in the following format: 
    {
      "question": "",
      "choices": ["", "", ""],
      "correctIndex": 0,
      "level": ${currentLevel}
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
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
