import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function POST(request: Request) {
  const { url } = await request.json();
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "No url provided" }, { status: 400 });
  }
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    });
    const $ = cheerio.load(response.data);
    // Try to extract main content from <article>, or common content containers, fallback to body
    let text =
      $("article").text() ||
      $('[class*="content"]').text() ||
      $('[class*="article"]').text() ||
      $("body").text();
    text = text.replace(/\s+/g, " ").trim();
    // Remove any HTML tags that may have been left in
    text = text.replace(/<[^>]*>/g, "");
    // Filter out if text is too short or contains iframe/script
    if (!text || text.length < 30 || /<iframe|<script/i.test(text)) {
      console.error(
        "Scraping error: text too short or empty or contains HTML",
        { url, text }
      );
      return NextResponse.json(
        { error: "Failed to extract main content", debug: { url, text } },
        { status: 422 }
      );
    }
    return NextResponse.json({ text });
  } catch (error) {
    console.error("Scraping failed", {
      url,
      error: error instanceof Error ? error.message : error,
    });
    return NextResponse.json(
      {
        error: "Scraping failed",
        debug: { url, error: error instanceof Error ? error.message : error },
      },
      { status: 500 }
    );
  }
}
