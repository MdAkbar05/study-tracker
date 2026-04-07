// app/api/tasks/route.js
import prisma from "@/lib/prisma";
import { isAdmin, forbiddenResponse } from "@/lib/auth";
import { TASK_TYPES } from "@/lib/constants";

const VALID_TYPES = Object.values(TASK_TYPES);

// ─── GET /api/tasks — public, any visitor can read ───────────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type      = searchParams.get("type");
    const completed = searchParams.get("completed");
    const search    = searchParams.get("search");

    const where = {};
    if (type && VALID_TYPES.includes(type)) where.type = type;
    if (completed !== null && completed !== undefined) {
      where.completed = completed === "true";
    }
    if (search) {
      where.OR = [
        { title:       { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: [{ deadline: "asc" }],
    });

    return Response.json({ success: true, data: tasks, count: tasks.length });
  } catch (err) {
    console.error("[GET /api/tasks]", err);
    return Response.json({ success: false, error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// ─── POST /api/tasks — admin only ────────────────────────────────────────────
export async function POST(request) {
  if (!isAdmin(request)) return forbiddenResponse();

  try {
    const body = await request.json();
    const { title, description, deadline, type } = body;

    // Validate
    if (!title?.trim()) {
      return Response.json({ success: false, error: "Title is required" }, { status: 400 });
    }
    if (!deadline || isNaN(new Date(deadline).getTime())) {
      return Response.json({ success: false, error: "Valid deadline is required" }, { status: 400 });
    }
    if (!type || !VALID_TYPES.includes(type)) {
      return Response.json(
        { success: false, error: `Type must be one of: ${VALID_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        deadline: new Date(deadline),
        type,
        completed: false,
        inProgress: false,
      },
    });

    return Response.json({ success: true, data: task }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/tasks]", err);
    return Response.json({ success: false, error: "Failed to create task" }, { status: 500 });
  }
}
