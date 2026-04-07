// components/TaskCard.jsx
"use client";
import { useState, useEffect } from "react";
import {
  RiCheckLine,
  RiDeleteBinLine,
  RiTimeLine,
  RiEditLine,
  RiPlayLine,
  RiPauseLine,
  RiAlertFill,
  RiCalendarLine,
  RiFileTextLine,
  RiLockLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
} from "react-icons/ri";
import {
  getTimeRemaining,
  formatTimeRemaining,
  getUrgency,
  formatDeadline,
  getTaskStatus,
} from "@/lib/utils";
import { TASK_TYPE_LABELS, TASK_TYPE_COLORS, STATUS } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";

const urgencyColors = {
  overdue: "#f43f5e",
  critical: "#ea580c",
  high: "#d97706",
  medium: "#ca8a04",
  low: "#10b981",
};

const DESC_LIMIT = 120; // characters before truncation

export default function TaskCard({
  task,
  onComplete,
  onDelete,
  onToggleProgress,
  onEdit,
}) {
  const { isAdmin } = useAuth();
  const [, forceUpdate] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const id = setInterval(() => forceUpdate((n) => n + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const status = getTaskStatus(task);
  const remaining = getTimeRemaining(task.deadline);
  const urgency = getUrgency(remaining);
  const typeColors = TASK_TYPE_COLORS[task.type] || { accent: "#8b5cf6" };
  const isOverdue = status === STATUS.OVERDUE;
  const isCompleted = status === STATUS.COMPLETED;
  const isActive = status === STATUS.IN_PROGRESS;

  const desc = task.description || "";
  const isLong = desc.length > DESC_LIMIT;
  const displayDesc =
    isLong && !expanded ? desc.slice(0, DESC_LIMIT).trimEnd() + "…" : desc;

  return (
    <div
      className="card group relative overflow-hidden transition-all duration-300 animate-slide-in hover:shadow-md"
      style={{
        opacity: isCompleted ? 0.65 : 1,
        outline: isActive ? `2px solid ${typeColors.accent}55` : "none",
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ backgroundColor: typeColors.accent }}
      />

      <div className="pl-4 pr-4 py-4">
        {/* Top row: badges + actions */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className="tag"
              style={{
                backgroundColor: `${typeColors.accent}18`,
                color: typeColors.accent,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ backgroundColor: typeColors.accent }}
              />
              {TASK_TYPE_LABELS[task.type]}
            </span>
            {isActive && (
              <span
                className="tag"
                style={{
                  backgroundColor: "rgba(68,68,234,0.1)",
                  color: "#4444ea",
                }}
              >
                Active
              </span>
            )}
            {isCompleted && (
              <span
                className="tag"
                style={{
                  backgroundColor: "rgba(16,185,129,0.1)",
                  color: "#10b981",
                }}
              >
                ✓ Done
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            {isAdmin ? (
              <>
                {!isCompleted && (
                  <button
                    onClick={() => onToggleProgress(task.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer border-none"
                    style={
                      isActive
                        ? {
                            backgroundColor: "rgba(245,158,11,0.15)",
                            color: "#f59e0b",
                          }
                        : {
                            backgroundColor: "transparent",
                            color: "var(--text-secondary)",
                          }
                    }
                    title={isActive ? "Pause" : "Start"}
                  >
                    {isActive ? (
                      <RiPauseLine className="text-sm" />
                    ) : (
                      <RiPlayLine className="text-sm" />
                    )}
                  </button>
                )}
                <button
                  onClick={() => onEdit(task)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer border-none"
                  style={{
                    backgroundColor: "transparent",
                    color: "var(--text-secondary)",
                  }}
                  title="Edit"
                >
                  <RiEditLine className="text-sm" />
                </button>
                <button
                  onClick={() => onComplete(task.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer border-none"
                  style={
                    isCompleted
                      ? {
                          backgroundColor: "rgba(16,185,129,0.12)",
                          color: "#10b981",
                        }
                      : {
                          backgroundColor: "transparent",
                          color: "var(--text-secondary)",
                        }
                  }
                  title={isCompleted ? "Mark undone" : "Mark done"}
                >
                  <RiCheckLine className="text-sm" />
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer border-none"
                  style={{
                    backgroundColor: "transparent",
                    color: "var(--text-secondary)",
                  }}
                  title="Delete"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#f43f5e";
                    e.currentTarget.style.backgroundColor =
                      "rgba(244,63,94,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-secondary)";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <RiDeleteBinLine className="text-sm" />
                </button>
              </>
            ) : (
              <span
                className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-secondary)",
                }}
              >
                <RiLockLine className="text-xs" /> read only
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3
          className="font-display font-semibold text-sm sm:text-base leading-snug mb-1"
          style={{
            color: isCompleted
              ? "var(--text-secondary)"
              : "var(--text-primary)",
            textDecoration: isCompleted ? "line-through" : "none",
          }}
        >
          {task.title}
        </h3>

        {/* Description with expand/collapse */}
        {desc && (
          <div className="mb-3">
            <div className="flex gap-1.5">
              <RiFileTextLine
                className="shrink-0 mt-0.5 text-xs"
                style={{ color: "var(--text-secondary)" }}
              />
              <div>
                <p
                  className="text-xs leading-relaxed"
                  style={{
                    color: "var(--text-secondary)",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {displayDesc}
                </p>

                {/* See more / See less */}
                {isLong && (
                  <button
                    onClick={() => setExpanded((v) => !v)}
                    className="mt-1 flex items-center gap-0.5 text-[11px] font-semibold cursor-pointer border-none bg-transparent transition-opacity hover:opacity-80"
                    style={{ color: typeColors.accent }}
                  >
                    {expanded ? (
                      <>
                        <RiArrowUpSLine className="text-sm" /> See less
                      </>
                    ) : (
                      <>
                        <RiArrowDownSLine className="text-sm" /> See more
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer: date + countdown */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
          <div
            className="flex items-center gap-1 text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            <RiCalendarLine className="text-sm" />
            <span>{formatDeadline(task.deadline)}</span>
          </div>
          {!isCompleted && (
            <div
              className={`flex items-center gap-1 text-xs font-semibold font-mono ${isOverdue ? "urgent-pulse" : ""}`}
              style={{ color: urgencyColors[urgency] }}
            >
              {isOverdue ? (
                <>
                  <RiAlertFill className="text-sm" />
                  <span>Overdue!</span>
                </>
              ) : (
                <>
                  <RiTimeLine className="text-sm" />
                  <span>{formatTimeRemaining(remaining)}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
