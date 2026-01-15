import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function GET(request: Request) {
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

    const chapters = await prisma.chapter.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        archetype: true,
        tone: true,
        status: true,
        futureVision: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ chapters });
  } catch (error) {
    console.error("List chapters error:", error);
    return NextResponse.json({ error: "Failed to list chapters" }, { status: 500 });
  }
}
