import { NextResponse } from "next/server";

// Helper to dynamically import and use @vitalets/google-translate-api
async function translate(text: string, opts: { to: string }) {
  try {
    const mod = await import("@vitalets/google-translate-api");
    // Try both .default and .translate for compatibility
    // Try .translate (named export) first, then .default (for ESM/CJS interop)
    if (typeof mod.translate === "function") {
      return await mod.translate(text, opts);
    }
    if (mod.default && typeof mod.default.translate === "function") {
      return await mod.default.translate(text, opts);
    }
    throw new Error(
      "No callable export found in @vitalets/google-translate-api"
    );
  } catch (err) {
    throw new Error(
      "Translation API import or call failed: " +
        (err instanceof Error ? err.message : String(err))
    );
  }
}

// Fallback dictionary for when the API is unavailable
const urduDict: Record<string, string> = {
  the: "وہ",
  and: "اور",
  is: "ہے",
  are: "ہیں",
  this: "یہ",
  that: "وہ",
  in: "میں",
  on: "پر",
  he: "وہ",
  she: "وہ",
  it: "یہ",
  we: "ہم",
  you: "تم",
  they: "وہ",
  my: "میرا",
  your: "تمہارا",
  good: "اچھا",
  bad: "برا",
  day: "دن",
  night: "رات",
  hello: "سلام",
  world: "دنیا",
  computer: "کمپیوٹر",
  book: "کتاب",
  school: "اسکول",
  student: "طالب علم",
  teacher: "استاد",
  friend: "دوست",
  love: "محبت",
  peace: "امن",
  food: "کھانا",
  water: "پانی",
  house: "گھر",
  car: "گاڑی",
  road: "سڑک",
  city: "شہر",
  country: "ملک",
  language: "زبان",
  english: "انگریزی",
  urdu: "اردو",
  pakistan: "پاکستان",
  india: "بھارت",
  sun: "سورج",
  moon: "چاند",
  star: "ستارہ",
  sky: "آسمان",
  earth: "زمین",
  fire: "آگ",
  air: "ہوا",
  tree: "درخت",
  flower: "پھول",
  happy: "خوش",
  sad: "اداس",
  big: "بڑا",
  small: "چھوٹا",
  fast: "تیز",
  slow: "آہستہ",
  old: "پرانا",
  new: "نیا",
  boy: "لڑکا",
  girl: "لڑکی",
  father: "والد",
  mother: "والدہ",
  brother: "بھائی",
  sister: "بہن",
  child: "بچہ",
  children: "بچے",
  work: "کام",
  play: "کھیلنا",
  run: "دوڑنا",
  walk: "چلنا",
  read: "پڑھنا",
  write: "لکھنا",
  speak: "بولنا",
  listen: "سننا",
  see: "دیکھنا",
  eat: "کھانا",
  drink: "پینا",
  sleep: "سونا",
  wake: "جاگنا",
  open: "کھولنا",
  close: "بند کرنا",
  start: "شروع کرنا",
  end: "ختم کرنا",
  come: "آنا",
  go: "جانا",
  give: "دینا",
  take: "لینا",
  make: "بنانا",
  do: "کرنا",
  know: "جاننا",
  think: "سوچنا",
  understand: "سمجھنا",
  question: "سوال",
  answer: "جواب",
  yes: "ہاں",
  no: "نہیں",
  please: "براہ مہربانی",
  thanks: "شکریہ",
  sorry: "معاف کرنا",
  welcome: "خوش آمدید",
  morning: "صبح",
  evening: "شام",
  today: "آج",
  tomorrow: "کل",
  yesterday: "کل",
  time: "وقت",
  year: "سال",
  month: "مہینہ",
  week: "ہفتہ",
  hour: "گھنٹہ",
  minute: "منٹ",
  second: "سیکنڈ",
  // ...add more as needed
};

export async function POST(request: Request) {
  const { text } = await request.json();
  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }

  try {
    // Use @vitalets/google-translate-api
    const result = await translate(text, { to: "ur" });
    if (result && typeof result.text === "string") {
      return NextResponse.json({ translated: result.text });
    } else {
      throw new Error("API response format unexpected");
    }
  } catch (error) {
    console.error("Translation API error:", error);
    // Fallback to dictionary-based translation if API fails
    const translated = text
      .split(" ")
      .map((word: string) => urduDict[word.toLowerCase()] || word)
      .join(" ");
    return NextResponse.json({
      translated,
      note: "Used fallback dictionary translation due to API issue",
    });
  }
}
