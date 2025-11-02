import { db } from "@/config/db";
import { chatTable, frameTable, projectsTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { projectId, frameId, messages } = await req.json();
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create project
    await db.insert(projectsTable).values({
      projectId,
      createdBy: user.primaryEmailAddress?.emailAddress,
    });

    // Create frame
    await db.insert(frameTable).values({
      frameId,
      projectId,
    });

    // Save user messages
    await db.insert(chatTable).values({
      chatMessage: messages,
      createdBy: user.primaryEmailAddress?.emailAddress,
    });

    return NextResponse.json({ projectId, frameId, messages }, { status: 200 });
  } catch (error) {
    console.error("Error creating project/frame/chat:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
