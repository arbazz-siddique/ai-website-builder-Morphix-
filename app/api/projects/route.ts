import { db } from "@/config/db";
import { chatTable, frameTable, projectsTable, usersTable } from "@/config/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { projectId, frameId, messages,credits } = await req.json();
    const user = await currentUser();

    const {has} = await auth();
     const hasUnlimitedAccess = has&&has({plan:'unlimited'})

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
      frameId: frameId,
      createdBy: user.primaryEmailAddress?.emailAddress,
    });

    //update user credits
    if(!hasUnlimitedAccess){
 const userResult = await db.update(usersTable).set({
      credits:credits-1
    }) //@ts-ignore
    .where(eq(usersTable.email, user?.primaryEmailAddress?.emailAddress))
    }
   

    return NextResponse.json({ projectId, frameId, messages }, { status: 200 });
  } catch (error) {
    console.error("Error creating project/frame/chat:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
