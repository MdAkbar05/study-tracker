// components/StatsBar.jsx
"use client";
import { RiCheckboxCircleLine, RiTimeLine, RiAlertLine, RiFireLine } from "react-icons/ri";
import { getTaskStatus, getCompletionRate } from "@/lib/utils";
import { STATUS } from "@/lib/constants";

export default function StatsBar({ tasks }) {
  const total      = tasks.length;
  const completed  = tasks.filter((t) => t.completed).length;
  const overdue    = tasks.filter((t) => getTaskStatus(t) === STATUS.OVERDUE).length;
  const inProgress = tasks.filter((t) => getTaskStatus(t) === STATUS.IN_PROGRESS).length;
  const rate       = getCompletionRate(tasks);

  const stats = [
    { label: "Total",   value: total,      icon: RiTimeLine,           color: "#4444ea", bg: "rgba(68,68,234,0.08)" },
    { label: "Done",    value: completed,  icon: RiCheckboxCircleLine, color: "#10b981", bg: "rgba(16,185,129,0.08)" },
    { label: "Active",  value: inProgress, icon: RiFireLine,           color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
    { label: "Overdue", value: overdue,    icon: RiAlertLine,          color: "#f43f5e", bg: "rgba(244,63,94,0.08)"  },
  ];

  return (
    <div className="card p-4 sm:p-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="grid grid-cols-4 gap-2 sm:gap-3 flex-1">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mx-auto mb-1"
                style={{ backgroundColor: s.bg }}>
                <s.icon className="text-base sm:text-lg" style={{ color: s.color }} />
              </div>
              <div className="font-display font-bold text-lg sm:text-2xl leading-none" style={{ color: "var(--text-primary)" }}>
                {s.value}
              </div>
              <div className="text-[10px] sm:text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
        {total > 0 && (
          <div className="sm:pl-5 sm:min-w-[130px]" style={{ borderLeft: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Progress</span>
              <span className="font-display font-bold text-sm" style={{ color: "#4444ea" }}>{rate}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${rate}%` }} />
            </div>
            <p className="text-[10px] mt-1" style={{ color: "var(--text-secondary)" }}>
              {completed} of {total} tasks done
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
