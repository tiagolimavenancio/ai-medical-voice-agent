import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { usersTable, SessionChatTable } from "@/config/schema";
import { eq, desc } from "drizzle-orm";

// POST: Create session or user
export async function POST(req: Request) {
  try {
    const user = await currentUser();

    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.primaryEmailAddress.emailAddress;
    const body = await req.json();
    console.log("📨 Incoming POST body:", body);

    // If session details are present, treat as session creation
    if (body.selectedDoctor && body.notes) {
      const sessionId = Math.random().toString(36).substring(2, 10);

      const result = await db
        .insert(SessionChatTable)
        .values({
          sessionid: sessionId,
          notes: body.notes,
          selectedDoctor: body.selectedDoctor,
          createdOn: new Date().toISOString(),
          createdBy: email,
        })
        .returning();

      console.log("✅ Session created:", result[0]);
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

      console.log("👤 New user created:", newUser[0]);
      return NextResponse.json(newUser[0], { status: 201 });
    }

    return NextResponse.json(existing[0], { status: 200 });
  } catch (error) {
    console.error("❌ POST handler error:", error);
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
    const sessionId = searchParams.get("sessionid");

    if (sessionId === "all") {
      const result = await db
        .select()
        .from(SessionChatTable)
        .where(eq(SessionChatTable.createdBy, email))
        .orderBy(desc(SessionChatTable.id));

      if (result.length === 0) {
        return NextResponse.json({ error: "No sessions found" }, { status: 404 });
      }

      return NextResponse.json(result, { status: 200 });
    } else {
      const result = await db
        .select()
        .from(SessionChatTable)
        .where(eq(SessionChatTable.sessionid, sessionId!));

      if (result.length === 0) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
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
    console.error("❌ GET handler error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
