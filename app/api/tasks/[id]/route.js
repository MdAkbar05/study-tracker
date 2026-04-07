// app/api/tasks/[id]/route.js
import prisma from "@/lib/prisma";
import { isAdmin, forbiddenResponse } from "@/lib/auth";
import { TASK_TYPES } from "@/lib/constants";

const VALID_TYPES = Object.values(TASK_TYPES);

// Helper — find task or return 404
async function findTask(id) {
  try {
    return await prisma.task.findUnique({ where: { id } });
  } catch {
    return null;
  }
}

// ─── GET /api/tasks/:id — public ─────────────────────────────────────────────
export async function GET(request, { params }) {
  const { id } = await params;
  const task = await findTask(id);
  if (!task) {
    return Response.json({ success: false, error: "Task not found" }, { status: 404 });
  }
  return Response.json({ success: true, data: task });
}

// ─── PATCH /api/tasks/:id — admin only ───────────────────────────────────────
export async function PATCH(request, { params }) {
  if (!isAdmin(request)) return forbiddenResponse();

  const { id } = await params;
  const task = await findTask(id);
  if (!task) {
    return Response.json({ success: false, error: "Task not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const updateData = {};

    if (body.title       !== undefined) updateData.title       = body.title.trim();
    if (body.description !== undefined) updateData.description = body.description?.trim() || null;
    if (body.deadline    !== undefined) {
      const d = new Date(body.deadline);
      if (isNaN(d.getTime())) {
        return Response.json({ success: false, error: "Invalid deadline" }, { status: 400 });
      }
      updateData.deadline = d;
    }
    if (body.type !== undefined) {
      if (!VALID_TYPES.includes(body.type)) {
        return Response.json({ success: false, error: "Invalid task type" }, { status: 400 });
      }
      updateData.type = body.type;
    }
    if (body.completed   !== undefined) updateData.completed   = Boolean(body.completed);
    if (body.inProgress  !== undefined) updateData.inProgress  = Boolean(body.inProgress);

    // Mutual exclusivity: completing clears inProgress
    if (updateData.completed === true) updateData.inProgress = false;

    const updated = await prisma.task.update({ where: { id }, data: updateData });
    return Response.json({ success: true, data: updated });
  } catch (err) {
    console.error("[PATCH /api/tasks/:id]", err);
    return Response.json({ success: false, error: "Failed to update task" }, { status: 500 });
  }
}

// ─── DELETE /api/tasks/:id — admin only ──────────────────────────────────────
export async function DELETE(request, { params }) {
  if (!isAdmin(request)) return forbiddenResponse();

  const { id } = await params;
  const task = await findTask(id);
  if (!task) {
    return Response.json({ success: false, error: "Task not found" }, { status: 404 });
  }

  try {
    await prisma.task.delete({ where: { id } });
    return Response.json({ success: true, message: "Task deleted" });
  } catch (err) {
    console.error("[DELETE /api/tasks/:id]", err);
    return Response.json({ success: false, error: "Failed to delete task" }, { status: 500 });
  }
}
