import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const enhancedPrompt = `You are an expert React/TypeScript developer. Generate clean, production-ready React component code based on this description: "${prompt}"

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

Return ONLY the code, no explanations or markdown. Start directly with the code.`;

    const result = await model.generateContent(enhancedPrompt);
    const response = result.response;
    const code = response.text();

    return NextResponse.json({ success: true, code });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}