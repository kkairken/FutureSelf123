import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";


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

    const { name, language } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!["en", "ru", "kz"].includes(language)) {
      return NextResponse.json({ error: "Invalid language" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name.trim(),
        language,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Complete profile error:", error);
    return NextResponse.json({ error: "Failed to complete profile" }, { status: 500 });
  }
}
