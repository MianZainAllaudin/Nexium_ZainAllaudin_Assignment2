import { NextResponse } from "next/server";
import { saveToMongo } from "../../lib/mongodb";

export async function POST(request: Request) {
  try {
    const { url, text } = await request.json();
    if (!url || !text) {
      return NextResponse.json(
        { error: "Missing url or text" },
        { status: 400 }
      );
    }
    await saveToMongo(url, text);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
