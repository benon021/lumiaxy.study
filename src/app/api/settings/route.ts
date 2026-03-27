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
      select: { 
        preferences: true, 
        role: true, 
        name: true, 
        email: true, 
        avatarUrl: true, 
        coverUrl: true,
        bio: true, 
        teacherProfile: {
          include: { subjects: true }
        }
      }
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
        preferences,
        subjects: dbUser?.teacherProfile?.subjects || [],
        credentials: dbUser?.teacherProfile?.credentials,
        officeHours: dbUser?.teacherProfile?.officeHours,
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
    const { name, bio, preferences, avatarUrl, coverUrl, credentials, officeHours, subjects } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (coverUrl !== undefined) updateData.coverUrl = coverUrl;
    if (preferences !== undefined) {
      updateData.preferences = JSON.stringify(preferences);
    }

    // Update teacher profile if role is TEACHER
    if (user.role === "TEACHER") {
      updateData.teacherProfile = {
        upsert: {
          create: {
            credentials: credentials || "",
            officeHours: officeHours || "",
            subjects: subjects ? { connect: subjects.map((id: string) => ({ id })) } : undefined
          },
          update: {
            ...(credentials !== undefined && { credentials }),
            ...(officeHours !== undefined && { officeHours }),
            ...(subjects !== undefined && {
              subjects: {
                set: subjects.map((id: string) => ({ id }))
              }
            })
          }
        }
      };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updateData
    });

    const finalUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { 
        preferences: true, 
        role: true, 
        name: true, 
        email: true, 
        avatarUrl: true, 
        coverUrl: true,
        bio: true, 
        teacherProfile: {
          include: { subjects: true }
        }
      }
    });

    const finalPrefs = finalUser?.preferences ? JSON.parse(finalUser.preferences) : {};

    return NextResponse.json({
      success: true,
      data: {
        ...finalUser,
        preferences: finalPrefs,
        subjects: finalUser?.teacherProfile?.subjects || [],
        credentials: finalUser?.teacherProfile?.credentials,
        officeHours: finalUser?.teacherProfile?.officeHours,
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
