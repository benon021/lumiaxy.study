import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

    const setting = await (prisma as any).setting.findUnique({
      where: { key }
    });

    if (!setting) return NextResponse.json({ value: "" });

    // Mask value
    const masked = setting.value.length > 8 
      ? setting.value.substring(0, 4) + "****" + setting.value.substring(setting.value.length - 4)
      : "****";

    return NextResponse.json({ value: masked });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { key, value } = await req.json();
    console.log('Admin saving setting:', key);

    if (!key || !value) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await (prisma as any).setting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
