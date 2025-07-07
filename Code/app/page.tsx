"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function BlogSummarizer() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [urduTranslation, setUrduTranslation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSummary("");
    setUrduTranslation("");
    try {
      // Step 1: Scrape text
      const scrapeRes = await fetch("/api/scrape", {
        method: "POST",
        body: JSON.stringify({ url }),
      });
      const scrapeData = await scrapeRes.json();
      const text = scrapeData.text;

      // Step 2: Generate summary
      const summaryRes = await fetch("/api/summarize", {
        method: "POST",
        body: JSON.stringify({ text, url }),
      });
      const summaryData = await summaryRes.json();
      const summary = summaryData.summary;
      if (!summary) {
        console.error("Summarization failed:", summaryData.error);
        alert(
          "Summarization failed: " + (summaryData.error || "Unknown error")
        );
        setLoading(false);
        return;
      }

      // Step 3: Translate to Urdu
      const translateRes = await fetch("/api/translate", {
        method: "POST",
        body: JSON.stringify({ text: summary }),
      });
      const translateData = await translateRes.json();
      const translated = translateData.translated;
      if (!translated) {
        console.error("Translation failed:", translateData.error);
        alert(
          "Translation failed: " + (translateData.error || "Unknown error")
        );
        setLoading(false);
        return;
      }

      // Save to databases
      await saveToMongo(url, text); // MongoDB
      await supabase
        .from("summaries")
        .insert({ url, summary, urdu_translation: translated }); // Supabase

      setSummary(summary);
      setUrduTranslation(translated);
    } catch (err) {
      alert("An error occurred during summarization.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">📝 Blog Summarizer</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <Input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter blog URL"
          disabled={loading}
        />
        <Button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? <Spinner /> : null}
          {loading ? "Summarizing..." : "Summarize"}
        </Button>
      </form>

      {loading && (
        <div className="mt-8 flex items-center gap-2 text-muted-foreground">
          <Spinner className="w-6 h-6" />
          <span>Summarizing, translating, and saving...</span>
        </div>
      )}

      {summary && !loading && (
        <div className="mt-8 space-y-4">
          <Card>
            <CardContent className="p-4">
              <h2 className="font-bold mb-2">Summary (English):</h2>
              <p>{summary}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h2 className="font-bold mb-2">Urdu Translation:</h2>
              <p>{urduTranslation}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
// Save scraped blog text to MongoDB via API route
async function saveToMongo(url: string, text: string) {
  console.log("Saving to MongoDB:", { url, text });
  const res = await fetch("/api/save-to-mongo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, text }),
  });
  if (!res.ok) {
    const error = await res.json();
    console.error("Failed to save to MongoDB:", error);
  } else {
    console.log("Saved to MongoDB successfully");
  }
}
