import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { text } = await request.json();
  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }

  // Mock "AI" summary: Extract first 2 sentences + keywords
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const summary = sentences.slice(0, 2).join(" ");
  const keywords = [...new Set(text.split(/\s+/).slice(0, 10))]; // Mock keywords

  return NextResponse.json({ summary, keywords });
}
// Note: This is a mock implementation. In a real scenario, you would use an AI model or library to generate the summary.
