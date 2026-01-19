import { NextResponse } from "next/server";
import { getDocContent } from "@/lib/docs";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { key: string } }
) {
  const url = new URL(request.url);
  const locale = url.searchParams.get("locale") || "ru";
  const key = params.key;

  const allowedKeys = ["offer", "privacy", "terms", "payment", "delivery", "contacts"];
  if (!allowedKeys.includes(key)) {
    return NextResponse.json({ error: "Invalid doc key" }, { status: 400 });
  }

  try {
    const { title, body } = getDocContent(key as any, locale as any);
    return NextResponse.json({ title, body });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load document" }, { status: 500 });
  }
}
