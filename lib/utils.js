// lib/utils.js
import { TASK_TYPE_PRIORITY, STATUS } from "./constants.js";

export function getTimeRemaining(deadline) {
  return new Date(deadline).getTime() - Date.now();
}

export function formatTimeRemaining(ms) {
  if (ms <= 0) return "Overdue";
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function getUrgency(ms) {
  if (ms <= 0)                      return "overdue";
  if (ms < 3600 * 1000)             return "critical";
  if (ms < 24 * 3600 * 1000)        return "high";
  if (ms < 3 * 24 * 3600 * 1000)    return "medium";
  return "low";
}

export const urgencyColors = {
  overdue:  "#f43f5e",
  critical: "#ea580c",
  high:     "#d97706",
  medium:   "#ca8a04",
  low:      "#10b981",
};

export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    const remA = getTimeRemaining(a.deadline);
    const remB = getTimeRemaining(b.deadline);
    if (remA <= 0 && remB <= 0)
      return (TASK_TYPE_PRIORITY[b.type] || 0) - (TASK_TYPE_PRIORITY[a.type] || 0);
    if (remA <= 0) return -1;
    if (remB <= 0) return 1;
    if (remA !== remB) return remA - remB;
    return (TASK_TYPE_PRIORITY[b.type] || 0) - (TASK_TYPE_PRIORITY[a.type] || 0);
  });
}

export function getTaskStatus(task) {
  if (task.completed) return STATUS.COMPLETED;
  if (getTimeRemaining(task.deadline) <= 0) return STATUS.OVERDUE;
  if (task.inProgress) return STATUS.IN_PROGRESS;
  return STATUS.PENDING;
}

export function formatDeadline(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function getCompletionRate(tasks) {
  if (!tasks.length) return 0;
  return Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100);
}
