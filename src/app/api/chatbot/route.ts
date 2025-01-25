import { NextResponse } from "next/server";
import OpenAI from "openai";

if (!process.env.DEEPSEEK_API_KEY) {
  throw new Error(
    "DEEPSEEK_API_KEY is not defined. Please add it to the .env file with the name OPENAI_API_KEY"
  );
}

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || Array.isArray(messages) === false) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. When responding to user queries, provide clear and concise answers. If the response includes code, format it using Markdown code blocks. For example, use triple backticks (```) for multi-line code or single backticks (`) for inline code. Always ensure that code is properly formatted and easy to read.",
        },
        ...messages,
      ],
    });
    if (!completion.choices[0].message.content) {
      throw new Error("No response from DeepSeek");
    }

    return NextResponse.json({
      message: completion.choices[0].message.content,
    });
  } catch (error: any) {
    console.error("APi error", error.message);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.status || 500 }
    );
  }
}
