// components/FilterBar.jsx
"use client";
import { RiSearchLine, RiFilterLine } from "react-icons/ri";
import { TASK_TYPE_LABELS, TASK_TYPES } from "@/lib/constants";

const statusFilters = [
  { key: "all",         label: "All" },
  { key: "pending",     label: "Pending" },
  { key: "in-progress", label: "Active" },
  { key: "completed",   label: "Done" },
  { key: "overdue",     label: "Overdue" },
];

export default function FilterBar({ search, setSearch, statusFilter, setStatusFilter, typeFilter, setTypeFilter, taskCount }) {
  return (
    <div className="card p-3 sm:p-4 space-y-3 animate-fade-in">
      <div className="relative">
        <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--text-secondary)" }} />
        <input type="text" placeholder="Search tasks…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field" style={{ paddingLeft: "2.25rem", paddingTop: "0.625rem", paddingBottom: "0.625rem" }} />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {statusFilters.map((f) => (
          <button key={f.key} onClick={() => setStatusFilter(f.key)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-95 cursor-pointer border-none"
            style={statusFilter === f.key
              ? { backgroundColor: "#4444ea", color: "#fff" }
              : { backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}>
            {f.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <RiFilterLine className="text-sm flex-shrink-0" style={{ color: "var(--text-secondary)" }} />
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setTypeFilter("all")}
            className="text-xs font-medium px-2.5 py-1 rounded-lg transition-all duration-200 cursor-pointer border-none"
            style={typeFilter === "all"
              ? { backgroundColor: "var(--text-primary)", color: "var(--bg-primary)" }
              : { backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}>
            All Types
          </button>
          {Object.values(TASK_TYPES).map((val) => (
            <button key={val} onClick={() => setTypeFilter(val)}
              className="text-xs font-medium px-2.5 py-1 rounded-lg transition-all duration-200 cursor-pointer border-none"
              style={typeFilter === val
                ? { backgroundColor: "var(--text-primary)", color: "var(--bg-primary)" }
                : { backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}>
              {TASK_TYPE_LABELS[val]}
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
        Showing <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{taskCount}</span> tasks
      </p>
    </div>
  );
}
