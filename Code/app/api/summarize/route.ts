// import { NextResponse } from "next/server";
// import { pipeline } from "@xenova/transformers";
// import { saveToMongo } from "../../lib/mongodb";
//
// // Type for the summarizer function result
// type SummarizerResult = Array<{ summary_text: string }>;
// type SummarizerFn = (
//   text: string,
//   opts: { max_length?: number; min_length?: number; do_sample?: boolean }
// ) => Promise<SummarizerResult>;
//
// // Global variable to store the pipeline (initialized once)
// let summarizer: SummarizerFn | null = null;
// export async function POST(request: Request) {
//   const { text, url } = await request.json();
//
//   if (!text || typeof text !== "string") {
//     return NextResponse.json({ error: "No text provided" }, { status: 400 });
//   }
//   if (!url || typeof url !== "string") {
//     return NextResponse.json({ error: "No url provided" }, { status: 400 });
//   }
//
//   // Check if text is too short for meaningful summarization
//   if (text.length < 100) {
//     return NextResponse.json(
//       {
//         error:
//           "Text too short for summarization. Minimum 100 characters required.",
//       },
//       { status: 400 }
//     );
//   }
//
//   // Helper to save to MongoDB
//   async function saveSummaryToMongo(summary: string) {
//     try {
//       await saveToMongo(url, summary);
//     } catch (err) {
//       console.error("Failed to save to MongoDB:", err);
//     }
//   }
//
//   // Wrap the whole process in a timeout
//   const timeoutPromise = new Promise<never>((_, reject) =>
//     setTimeout(() => reject(new Error("Summarization timed out")), 10000)
//   );
//
//   // Summarizer pipeline
//   async function getSummarizer(): Promise<SummarizerFn> {
//     if (!summarizer) {
//       summarizer = (await pipeline(
//         "summarization",
//         "Xenova/distilbart-cnn-12-6"
//       )) as SummarizerFn;
//     }
//     return summarizer;
//   }
//
//   try {
//     const summarizerModel = await getSummarizer();
//     const result = await Promise.race([
//       summarizerModel(text, {
//         max_length: 150,
//         min_length: 50,
//         do_sample: false,
//       }),
//       timeoutPromise,
//     ]);
//     const summary = (result as SummarizerResult)[0].summary_text;
//     const keywords = extractKeywords(text);
//     await saveSummaryToMongo(summary);
//     return NextResponse.json({
//       summary,
//       keywords,
//       source: "Transformers.js (Offline AI)",
//       model: "DistilBART-CNN",
//       note: "Completely free and runs offline",
//     });
//   } catch (error) {
//     console.error("Summarization error:", error);
//     // Fallback summary and keywords
//     const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
//     const summary = sentences.slice(0, 3).join(" ").trim();
//     const keywords = extractKeywords(text);
//     await saveSummaryToMongo(summary);
//     return NextResponse.json({
//       summary: summary || "Unable to generate summary.",
//       keywords,
//       source: "Fallback Method",
//       note: "Model loading failed, timed out, or using basic extraction",
//     });
//   }
// }
// // (no trailing brace)
//
// function extractKeywords(text: string): string[] {
//   // Simple but effective keyword extraction
//   const words = text
//     .toLowerCase()
//     .replace(/[^\w\s]/g, "")
//     .split(/\s+/)
//     .filter((word) => word.length > 3)
//     .filter((word) => !isStopWord(word));
//
//   // Count word frequency
//   const wordCount: Record<string, number> = {};
//   words.forEach((word) => {
//     wordCount[word] = (wordCount[word] || 0) + 1;
//   });
//
//   // Return top 10 most frequent words
//   return Object.entries(wordCount)
//     .sort(([, a], [, b]) => b - a)
//     .slice(0, 10)
//     .map(([word]) => word);
// }
//
// function isStopWord(word: string): boolean {
//   const stopWords = new Set([
//     "the",
//     "a",
//     "an",
//     "and",
//     "or",
//     "but",
//     "in",
//     "on",
//     "at",
//     "to",
//     "for",
//     "of",
//     "with",
//     "by",
//     "from",
//     "up",
//     "about",
//     "into",
//     "through",
//     "during",
//     "before",
//     "after",
//     "above",
//     "below",
//     "between",
//     "among",
//     "is",
//     "are",
//     "was",
//     "were",
//     "be",
//     "been",
//     "being",
//     "have",
//     "has",
//     "had",
//     "do",
//     "does",
//     "did",
//     "will",
//     "would",
//     "should",
//     "could",
//     "can",
//     "may",
//     "might",
//     "must",
//     "this",
//     "that",
//     "these",
//     "those",
//     "i",
//     "you",
//     "he",
//     "she",
//     "it",
//     "we",
//     "they",
//     "me",
//     "him",
//     "her",
//     "us",
//     "them",
//     "my",
//     "your",
//     "his",
//     "her",
//     "its",
//     "our",
//     "their",
//   ]);
//   return stopWords.has(word);
// }

import { NextResponse } from "next/server";
import { pipeline } from "@xenova/transformers";
import { saveToMongo } from "../../lib/mongodb";

// Type for the summarizer function result
type SummarizerResult = Array<{ summary_text: string }>;
type SummarizerFn = (
  text: string,
  opts: { max_length?: number; min_length?: number; do_sample?: boolean }
) => Promise<SummarizerResult>;

// Global variable to store the pipeline (initialized once)
let summarizer: SummarizerFn | null = null;

export async function POST(request: Request) {
  const { text, url } = await request.json();

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "No url provided" }, { status: 400 });
  }

  // Check if text is too short for meaningful summarization
  if (text.length < 100) {
    return NextResponse.json(
      {
        error:
          "Text too short for summarization. Minimum 100 characters required.",
      },
      { status: 400 }
    );
  }

  // Helper to save to MongoDB
  async function saveSummaryToMongo(summary: string) {
    try {
      await saveToMongo(url, summary);
    } catch (err) {
      console.error("Failed to save to MongoDB:", err);
    }
  }

  // Reduced timeout for Vercel's limits (10 seconds for hobby plan)
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Summarization timed out")), 10000)
  );

  // Summarizer pipeline with error handling for Vercel
  async function getSummarizer(): Promise<SummarizerFn> {
    if (!summarizer) {
      try {
        summarizer = (await pipeline(
          "summarization",
          "Xenova/distilbart-cnn-12-6"
        )) as SummarizerFn;
      } catch (error) {
        console.error("Failed to load model on Vercel:", error);
        throw new Error("Model loading failed on serverless environment");
      }
    }
    return summarizer;
  }

  try {
    const summarizerModel = await getSummarizer();
    const result = await Promise.race([
      summarizerModel(text, {
        max_length: 150,
        min_length: 50,
        do_sample: false,
      }),
      timeoutPromise,
    ]);
    const summary = (result as SummarizerResult)[0].summary_text;
    const keywords = extractKeywords(text);
    await saveSummaryToMongo(summary);
    return NextResponse.json({
      summary,
      keywords,
      source: "Transformers.js (Offline AI)",
      model: "DistilBART-CNN",
      note: "Completely free and runs offline",
    });
  } catch (error) {
    console.error("Summarization error:", error);
    // Enhanced fallback for Vercel deployment
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const summary = sentences.slice(0, 3).join(" ").trim();
    const keywords = extractKeywords(text);
    await saveSummaryToMongo(summary);
    return NextResponse.json({
      summary: summary || "Unable to generate summary.",
      keywords,
      source: "Fallback Method",
      note: "Model loading failed or timed out on serverless environment",
    });
  }
}

// Add explicit export for other HTTP methods to prevent 405 errors
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}

function extractKeywords(text: string): string[] {
  // Simple but effective keyword extraction
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .filter((word) => !isStopWord(word));

  // Count word frequency
  const wordCount: Record<string, number> = {};
  words.forEach((word) => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  // Return top 10 most frequent words
  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
}

function isStopWord(word: string): boolean {
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "up",
    "about",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "between",
    "among",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "should",
    "could",
    "can",
    "may",
    "might",
    "must",
    "this",
    "that",
    "these",
    "those",
    "i",
    "you",
    "he",
    "she",
    "it",
    "we",
    "they",
    "me",
    "him",
    "her",
    "us",
    "them",
    "my",
    "your",
    "his",
    "her",
    "its",
    "our",
    "their",
  ]);
  return stopWords.has(word);
}
