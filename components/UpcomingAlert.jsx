// components/UpcomingAlert.jsx
"use client";
import { RiBellLine, RiCloseLine } from "react-icons/ri";
import { useState } from "react";
import { getTimeRemaining, formatTimeRemaining } from "@/lib/utils";
import { TASK_TYPE_LABELS, TASK_TYPE_COLORS } from "@/lib/constants";

export default function UpcomingAlert({ tasks }) {
  const [dismissed, setDismissed] = useState(false);
  const urgent = tasks
    .filter((t) => { if (t.completed) return false; const r = getTimeRemaining(t.deadline); return r > 0 && r < 86400000; })
    .slice(0, 3);
  if (!urgent.length || dismissed) return null;
  return (
    <div className="card p-4 animate-slide-in" style={{ borderColor: "#f59e0b55", backgroundColor: "rgba(245,158,11,0.06)" }}>
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ backgroundColor: "rgba(245,158,11,0.15)" }}>
          <RiBellLine className="text-sm" style={{ color: "#f59e0b" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold mb-2" style={{ color: "#d97706" }}>
            {urgent.length} task{urgent.length > 1 ? "s" : ""} due within 24 hours!
          </p>
          <div className="space-y-1.5">
            {urgent.map((t) => {
              const colors = TASK_TYPE_COLORS[t.type] || { accent: "#8b5cf6" };
              return (
                <div key={t.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.accent }} />
                    <span className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>{t.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md flex-shrink-0"
                      style={{ backgroundColor: `${colors.accent}18`, color: colors.accent }}>
                      {TASK_TYPE_LABELS[t.type]}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold flex-shrink-0" style={{ color: "#f59e0b" }}>
                    {formatTimeRemaining(getTimeRemaining(t.deadline))}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <button onClick={() => setDismissed(true)}
          className="w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer border-none"
          style={{ color: "#f59e0b", backgroundColor: "transparent" }}>
          <RiCloseLine className="text-sm" />
        </button>
      </div>
    </div>
  );
}
