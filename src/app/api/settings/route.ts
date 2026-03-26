import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req as any);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { preferences: true, role: true, name: true, email: true, avatarUrl: true, bio: true, teacherProfile: true }
    });

    let preferences = {};
    if (dbUser?.preferences) {
      try {
        preferences = JSON.parse(dbUser.preferences);
      } catch (e) {
        console.error("Failed to parse preferences", e);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...dbUser,
        preferences
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getUserFromRequest(req as any);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, bio, preferences, avatarUrl, credentials, officeHours } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (preferences !== undefined) {
      updateData.preferences = JSON.stringify(preferences);
    }

    // Update teacher profile if role is TEACHER
    if (user.role === "TEACHER" && (credentials !== undefined || officeHours !== undefined)) {
      updateData.teacherProfile = {
        upsert: {
          create: {
            credentials: credentials || "",
            officeHours: officeHours || "",
          },
          update: {
            ...(credentials !== undefined && { credentials }),
            ...(officeHours !== undefined && { officeHours }),
          }
        }
      };
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: { preferences: true, name: true, bio: true, avatarUrl: true, teacherProfile: true }
    });

    return NextResponse.json({
      success: true,
      data: {
        name: updatedUser.name,
        bio: updatedUser.bio,
        avatarUrl: updatedUser.avatarUrl,
        credentials: updatedUser.teacherProfile?.credentials,
        officeHours: updatedUser.teacherProfile?.officeHours,
        preferences: updatedUser.preferences ? JSON.parse(updatedUser.preferences) : {}
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
