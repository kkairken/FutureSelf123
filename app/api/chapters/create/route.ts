import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import { generateChapter } from "@/lib/openai";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Check credits
    if (user.credits < 1) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 403 });
    }

    const data = await request.json();

    // Create chapter in pending status
    const chapter = await prisma.chapter.create({
      data: {
        userId: user.id,
        name: data.name,
        currentLife: data.currentLife,
        pastEvents: data.pastEvents,
        fears: data.fears,
        futureVision: data.futureVision,
        archetype: data.archetype,
        tone: data.tone,
        language: data.language || user.language || "en",
        status: "pending",
      },
    });

    // Deduct credit
    await prisma.user.update({
      where: { id: user.id },
      data: { credits: { decrement: 1 } },
    });

    // Generate chapter asynchronously
    generateChapterAsync(chapter.id, { ...data, language: chapter.language });

    return NextResponse.json({ success: true, chapterId: chapter.id });
  } catch (error) {
    console.error("Create chapter error:", error);
    return NextResponse.json({ error: "Failed to create chapter" }, { status: 500 });
  }
}

async function generateChapterAsync(chapterId: string, input: any) {
  try {
    await prisma.chapter.update({
      where: { id: chapterId },
      data: { status: "generating" },
    });

    const content = await generateChapter(input);

    await prisma.chapter.update({
      where: { id: chapterId },
      data: {
        content,
        status: "completed",
      },
    });
  } catch (error) {
    console.error("Generation error:", error);
    await prisma.chapter.update({
      where: { id: chapterId },
      data: { status: "failed" },
    });
  }
}
