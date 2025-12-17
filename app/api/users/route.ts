/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { db } from "@/config/db";
import { sessionChatTable, usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// POST: Create a user if not already in DB
export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.primaryEmailAddress.emailAddress;

    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));

    if (existing.length === 0) {
      const result = await db
        .insert(usersTable)
        .values({
          name: user?.fullName ?? "Unknown User",
          email: email,
          credits: 10,
        })
        .returning();

      const userRow = result[0];
      const safeUser = {
        ...userRow,
        id: Number(userRow.id),
      };

      return NextResponse.json(safeUser, { status: 201 });
    }

    const existingUser = existing[0];
    const safeExisting = {
      ...existingUser,
      id: Number(existingUser.id),
    };

    return NextResponse.json(safeExisting, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const user = await currentUser();

    if (!sessionId) {
      return NextResponse.json({ error: "Missing Session Id" }, { status: 400 });
    }

    const result = await db
      .select()
      .from(sessionChatTable)
      .where(eq(sessionChatTable.sessionId, sessionId));

    const session = result[0];
    const safeSession = session
      ? {
          ...session,
          id: Number(session.id),
          createdAt: session.createdOn ? new Date(session.createdOn).toISOString() : null,
        }
      : null;

    return NextResponse.json(safeSession, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
