// components/EmptyState.jsx
"use client";
import { RiBookOpenLine, RiAddLine, RiLockLine } from "react-icons/ri";
import { useAuth } from "@/hooks/useAuth";

export default function EmptyState({ onAddTask, filtered }) {
  const { isAdmin } = useAuth();
  return (
    <div className="card p-10 sm:p-16 flex flex-col items-center text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ backgroundColor: "rgba(68,68,234,0.08)" }}>
        <RiBookOpenLine className="text-3xl" style={{ color: "#7888fa" }} />
      </div>
      <h3 className="font-display font-bold text-lg mb-1" style={{ color: "var(--text-primary)" }}>
        {filtered ? "No matching tasks" : "No tasks yet"}
      </h3>
      <p className="text-sm mb-6 max-w-xs" style={{ color: "var(--text-secondary)" }}>
        {filtered
          ? "Try adjusting your filters or search query."
          : isAdmin
            ? "Add your first study task to get started."
            : "No tasks have been added yet. Log in as admin to create tasks."}
      </p>
      {!filtered && isAdmin && (
        <button onClick={onAddTask} className="btn-primary">
          <RiAddLine /> Add First Task
        </button>
      )}
      {!filtered && !isAdmin && (
        <div className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl"
          style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}>
          <RiLockLine /> Guest view — login as admin to add tasks
        </div>
      )}
    </div>
  );
}
