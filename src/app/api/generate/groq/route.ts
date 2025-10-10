import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert React/TypeScript developer. Generate clean, production-ready React component code.

Requirements:
- Generate a complete React functional component using TypeScript
- Use Tailwind CSS for all styling (no CSS modules or styled-components)
- Include "use client" directive at the top if needed
- Use modern React patterns (hooks, functional components)
- Include proper TypeScript types and interfaces
- Make it responsive and accessible
- Use lucide-react for any icons needed
- Follow best practices and clean code principles
- The component should be self-contained and ready to use

Return ONLY the code, no explanations or markdown. Start directly with the code.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4096,
    });

    const code = completion.choices[0]?.message?.content || "";

    return NextResponse.json({ success: true, code });
  } catch (error: any) {
    console.error("Groq API error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}