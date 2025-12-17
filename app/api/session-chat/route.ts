/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/config/db";
import { sessionChatTable, usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// POST: Create session or user
export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.primaryEmailAddress.emailAddress;
    const body = await req.json();

    // If session details are present, treat as session creation
    if (body.selectedDoctor && body.notes) {
      const sessionId = Math.random().toString(36).substring(2, 10);
      const result = await db
        .insert(sessionChatTable)
        .values({
          sessionId: sessionId,
          notes: body.notes,
          selectedDoctor: body.selectedDoctor,
          createdOn: new Date().toISOString(),
          createdBy: email,
        })
        .returning();

      return NextResponse.json({ data: result[0] }, { status: 201 });
    }

    // Fallback to user creation if not found
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));

    if (existing.length === 0) {
      const newUser = await db
        .insert(usersTable)
        .values({
          name: user.fullName ?? "Unknown User",
          email,
          credits: 10,
        })
        .returning();

      return NextResponse.json(newUser[0], { status: 201 });
    }

    return NextResponse.json(existing[0], { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET: Fetch session data by sessionid or all for current user
export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.primaryEmailAddress.emailAddress;
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (sessionId === "all") {
      const result = await db
        .select()
        .from(sessionChatTable)
        .where(eq(sessionChatTable.createdBy, email))
        .orderBy(desc(sessionChatTable.id));

      if (result.length === 0) {
        return NextResponse.json({ error: "No sessions found" }, { status: 404 });
      }

      return NextResponse.json(result, { status: 200 });
    } else {
      const result = await db
        .select()
        .from(sessionChatTable)
        .where(eq(sessionChatTable.sessionId, sessionId));

      if (result.length === 0) {
        return NextResponse.json({ error: "No sessions found" }, { status: 404 });
      }

      const session = result[0];

      const parsedSession = {
        ...session,
        selectedDoctor:
          typeof session.selectedDoctor === "string"
            ? JSON.parse(session.selectedDoctor)
            : session.selectedDoctor,
      };

      return NextResponse.json(parsedSession, { status: 200 });
    }
  } catch (error) {
    console.log("Error fetching session:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
