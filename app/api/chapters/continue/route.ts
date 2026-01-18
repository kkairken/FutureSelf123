import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import { generateChapterContinuation } from "@/lib/openai";

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

    if (user.credits < 1) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 403 });
    }

    const { bookId } = await request.json();

    if (!bookId) {
      return NextResponse.json({ error: "Book ID required" }, { status: 400 });
    }

    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        chapters: { orderBy: { chapterNumber: "desc" }, take: 1 },
      },
    });

    if (!book || book.userId !== user.id) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const lastChapter = book.chapters[0];
    const nextNumber = (lastChapter?.chapterNumber || 0) + 1;

    const chapter = await prisma.chapter.create({
      data: {
        userId: user.id,
        bookId: book.id,
        chapterNumber: nextNumber,
        name: book.name,
        currentLife: book.currentLife,
        pastEvents: book.pastEvents,
        fears: book.fears,
        futureVision: book.futureVision,
        archetype: book.archetype,
        tone: book.tone,
        language: book.language,
        status: "pending",
      },
    });

    await prisma.book.update({
      where: { id: book.id },
      data: { updatedAt: new Date() },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { credits: { decrement: 1 } },
    });

    generateContinuationAsync(chapter.id, {
      name: book.name,
      currentLife: book.currentLife,
      pastEvents: book.pastEvents,
      fears: book.fears,
      futureVision: book.futureVision,
      archetype: book.archetype,
      tone: book.tone,
      language: book.language,
      previousContent: lastChapter?.content || "",
      chapterNumber: nextNumber,
    });

    return NextResponse.json({ success: true, chapterId: chapter.id });
  } catch (error) {
    console.error("Continue chapter error:", error);
    return NextResponse.json({ error: "Failed to continue chapter" }, { status: 500 });
  }
}

async function generateContinuationAsync(chapterId: string, input: any) {
  try {
    await prisma.chapter.update({
      where: { id: chapterId },
      data: { status: "generating" },
    });

    const content = await generateChapterContinuation(input);

    await prisma.chapter.update({
      where: { id: chapterId },
      data: {
        content,
        status: "completed",
      },
    });
  } catch (error) {
    console.error("Continuation error:", error);
    await prisma.chapter.update({
      where: { id: chapterId },
      data: { status: "failed" },
    });
  }
}
