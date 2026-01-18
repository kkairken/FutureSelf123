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

    const { language } = await request.json();

    if (!["en", "ru", "kz"].includes(language)) {
      return NextResponse.json({ error: "Invalid language" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { language },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update language error:", error);
    return NextResponse.json({ error: "Failed to update language" }, { status: 500 });
  }
}
