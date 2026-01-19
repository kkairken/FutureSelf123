import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  buildResponseXml,
  getScriptNameFromPath,
  verifySig,
} from "@/lib/freedompay";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secretKey = process.env.FREEDOMPAY_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "FreedomPay not configured" }, { status: 500 });
  }

  const form = await request.formData();
  const params: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    params[key] = String(value);
  }

  const pathname = new URL(request.url).pathname;
  const scriptName = getScriptNameFromPath(pathname);

  if (!verifySig(scriptName, params, secretKey)) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const orderId = params.pg_order_id;
  if (!orderId) {
    const xml = buildResponseXml(scriptName, "error", "Missing order id", secretKey);
    return new NextResponse(xml, { status: 200, headers: { "Content-Type": "text/xml" } });
  }

  const payment = await prisma.payment.findFirst({
    where: {
      provider: "freedompay",
      pgOrderId: orderId,
    },
  });

  if (!payment) {
    const xml = buildResponseXml(scriptName, "rejected", "Order not found", secretKey);
    return new NextResponse(xml, { status: 200, headers: { "Content-Type": "text/xml" } });
  }

  const xml = buildResponseXml(scriptName, "ok", "Order available", secretKey);
  return new NextResponse(xml, { status: 200, headers: { "Content-Type": "text/xml" } });
}
