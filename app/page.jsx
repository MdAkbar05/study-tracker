// app/page.jsx
"use client";
import { useState, useMemo } from "react";
import Header from "@/components/Header";
import StatsBar from "@/components/StatsBar";
import FilterBar from "@/components/FilterBar";
import TaskList from "@/components/TaskList";
import AddTaskModal from "@/components/AddTaskModal";
import UpcomingAlert from "@/components/UpcomingAlert";
import { useTasks } from "@/hooks/useTasks";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { getTaskStatus } from "@/lib/utils";
import {
  RiDeleteBin5Line, RiRefreshLine, RiWifiOffLine, RiShieldLine,
} from "react-icons/ri";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useAuth();
  const {
    tasks, sortedTasks, loading, error,
    refetch, addTask, updateTask, deleteTask,
    toggleComplete, toggleInProgress, clearCompleted,
  } = useTasks();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTask,  setEditTask]  = useState(null);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter,   setTypeFilter]   = useState("all");

  const openAdd  = () => { setEditTask(null); setModalOpen(true); };
  const openEdit = (task) => { setEditTask(task); setModalOpen(true); };

  const handleSubmit = async (formData) => {
    if (editTask) await updateTask(editTask.id, formData);
    else await addTask(formData);
  };

  const filteredTasks = useMemo(() => sortedTasks.filter((task) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!task.title.toLowerCase().includes(q) && !(task.description || "").toLowerCase().includes(q)) return false;
    }
    if (statusFilter !== "all" && getTaskStatus(task) !== statusFilter) return false;
    if (typeFilter   !== "all" && task.type !== typeFilter) return false;
    return true;
  }), [sortedTasks, search, statusFilter, typeFilter]);

  const isFiltered   = search.trim() !== "" || statusFilter !== "all" || typeFilter !== "all";
  const hasCompleted = tasks.some((t) => t.completed);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Header theme={theme} toggleTheme={toggleTheme} onAddTask={openAdd} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {/* Page heading */}
        <div className="animate-fade-in">
          <h2 className="font-display font-bold text-xl sm:text-2xl" style={{ color: "var(--text-primary)" }}>
            Study Dashboard
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
            {loading
              ? "Loading tasks…"
              : tasks.length > 0
                ? `${tasks.filter((t) => !t.completed).length} pending task${tasks.filter((t) => !t.completed).length !== 1 ? "s" : ""}`
                : "No tasks yet"}
            {!isAdmin && (
              <span className="ml-2 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "rgba(68,68,234,0.1)", color: "#4444ea" }}>
                <RiShieldLine className="text-xs" /> Guest View
              </span>
            )}
          </p>
        </div>

        {/* Error state */}
        {error && (
          <div className="card p-4 flex items-center justify-between gap-3 animate-fade-in"
            style={{ borderColor: "rgba(244,63,94,0.3)", backgroundColor: "rgba(244,63,94,0.06)" }}>
            <div className="flex items-center gap-2">
              <RiWifiOffLine style={{ color: "#f43f5e" }} />
              <p className="text-sm font-medium" style={{ color: "#f43f5e" }}>{error}</p>
            </div>
            <button onClick={refetch}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer border-none"
              style={{ backgroundColor: "rgba(244,63,94,0.1)", color: "#f43f5e" }}>
              <RiRefreshLine /> Retry
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !error && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card h-24 animate-pulse" style={{ backgroundColor: "var(--bg-surface)" }} />
            ))}
          </div>
        )}

        {/* Main content */}
        {!loading && !error && (
          <>
            {tasks.length > 0 && <StatsBar tasks={tasks} />}
            <UpcomingAlert tasks={tasks} />
            {tasks.length > 0 && (
              <FilterBar
                search={search} setSearch={setSearch}
                statusFilter={statusFilter} setStatusFilter={setStatusFilter}
                typeFilter={typeFilter} setTypeFilter={setTypeFilter}
                taskCount={filteredTasks.length}
              />
            )}
            {isAdmin && hasCompleted && (
              <div className="flex justify-end animate-fade-in">
                <button onClick={clearCompleted}
                  className="flex items-center gap-1.5 text-xs transition-colors cursor-pointer border-none bg-transparent"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#f43f5e"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}>
                  <RiDeleteBin5Line /> Clear completed
                </button>
              </div>
            )}
            <TaskList
              tasks={filteredTasks}
              onComplete={isAdmin ? toggleComplete : undefined}
              onDelete={isAdmin ? deleteTask : undefined}
              onToggleProgress={isAdmin ? toggleInProgress : undefined}
              onEdit={isAdmin ? openEdit : undefined}
              onAddTask={openAdd}
              isFiltered={isFiltered}
            />
          </>
        )}
      </main>

      <footer className="mt-12 py-6 text-center" style={{ borderTop: "1px solid var(--border)" }}>
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          StudyTracker — Next.js 15 · Tailwind v4 · Prisma · MongoDB
        </p>
      </footer>

      {isAdmin && (
        <AddTaskModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          editTask={editTask}
        />
      )}
    </div>
  );
}
