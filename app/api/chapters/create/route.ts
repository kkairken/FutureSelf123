import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import { generateChapter } from "@/lib/openai";


export const dynamic = 'force-dynamic';

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

    let bookId = data.bookId as string | undefined;
    let book;

    if (bookId) {
      book = await prisma.book.findUnique({ where: { id: bookId } });
      if (!book || book.userId !== user.id) {
        return NextResponse.json({ error: "Book not found" }, { status: 404 });
      }
    } else {
      const title = data.bookTitle?.trim() || data.name?.trim() || "Untitled Story";
      book = await prisma.book.create({
        data: {
          userId: user.id,
          title,
          name: data.name,
          currentLife: data.currentLife,
          pastEvents: data.pastEvents,
          fears: data.fears,
          futureVision: data.futureVision,
          archetype: data.archetype,
          tone: data.tone,
          language: data.language || user.language || "en",
        },
      });
      bookId = book.id;
    }

    const chapterCount = await prisma.chapter.count({
      where: { bookId },
    });

    // Create chapter in pending status
    const chapter = await prisma.chapter.create({
      data: {
        userId: user.id,
        bookId,
        chapterNumber: chapterCount + 1,
        name: data.name,
        currentLife: book.currentLife,
        pastEvents: book.pastEvents,
        fears: book.fears,
        futureVision: book.futureVision,
        archetype: book.archetype,
        tone: book.tone,
        language: book.language,
        status: "generating",
      },
    });

    await prisma.book.update({
      where: { id: bookId },
      data: { updatedAt: new Date() },
    });

    // Deduct credit
    await prisma.user.update({
      where: { id: user.id },
      data: { credits: { decrement: 1 } },
    });

    const content = await generateChapter({
      name: book.name,
      currentLife: book.currentLife,
      pastEvents: book.pastEvents,
      fears: book.fears,
      futureVision: book.futureVision,
      archetype: book.archetype,
      tone: book.tone,
      language: chapter.language,
    });

    await prisma.chapter.update({
      where: { id: chapter.id },
      data: {
        content,
        status: "completed",
      },
    });

    return NextResponse.json({ success: true, chapterId: chapter.id, bookId });
  } catch (error) {
    console.error("Create chapter error:", error);
    if ((error as any)?.message?.includes("OPENAI_API_KEY")) {
      return NextResponse.json({ error: "OpenAI key missing" }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to create chapter" }, { status: 500 });
  }
}
