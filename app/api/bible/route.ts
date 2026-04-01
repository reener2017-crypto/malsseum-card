import { NextRequest, NextResponse } from "next/server";
import bibleData from "@/data/bible.json";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 1) {
    return NextResponse.json([]);
  }

  const results = bibleData.filter(
    (verse) =>
      verse.text.includes(query) ||
      verse.book.includes(query)
  );

  return NextResponse.json(results.slice(0, 20));
}
