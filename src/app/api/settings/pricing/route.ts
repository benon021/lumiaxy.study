import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: "PRICING_TIERS" }});
    return NextResponse.json({ success: true, pricing: setting?.value || null });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch pricing" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getUserFromRequest(req as any);
    if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { pricingJSON } = await req.json();

    const setting = await prisma.setting.upsert({
      where: { key: "PRICING_TIERS" },
      update: { value: pricingJSON },
      create: { key: "PRICING_TIERS", value: pricingJSON }
    });

    return NextResponse.json({ success: true, setting });
  } catch (err) {
    return NextResponse.json({ error: "Fail" }, { status: 500 });
  }
}
