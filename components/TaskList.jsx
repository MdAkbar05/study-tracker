// components/TaskList.jsx
"use client";
import TaskCard from "./TaskCard";
import EmptyState from "./EmptyState";
import { RiAlertLine, RiFireLine, RiCheckboxCircleLine, RiTimeLine } from "react-icons/ri";
import { getTaskStatus } from "@/lib/utils";
import { STATUS } from "@/lib/constants";

function SectionHeader({ icon: Icon, label, count, color }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="text-sm" style={{ color }} />
      <span className="section-title">{label}</span>
      <span className="text-xs font-bold px-2 py-0.5 rounded-full"
        style={{ color, backgroundColor: `${color}18` }}>{count}</span>
    </div>
  );
}

export default function TaskList({ tasks, onComplete, onDelete, onToggleProgress, onEdit, onAddTask, isFiltered }) {
  if (tasks.length === 0) return <EmptyState onAddTask={onAddTask} filtered={isFiltered} />;
  const overdue   = tasks.filter((t) => getTaskStatus(t) === STATUS.OVERDUE);
  const active    = tasks.filter((t) => getTaskStatus(t) === STATUS.IN_PROGRESS);
  const pending   = tasks.filter((t) => getTaskStatus(t) === STATUS.PENDING);
  const completed = tasks.filter((t) => getTaskStatus(t) === STATUS.COMPLETED);
  const props     = { onComplete, onDelete, onToggleProgress, onEdit };
  return (
    <div className="space-y-6 animate-fade-in">
      {overdue.length   > 0 && <section><SectionHeader icon={RiAlertLine}          label="Overdue"     count={overdue.length}   color="#f43f5e" /><div className="space-y-3">{overdue.map((t)   => <TaskCard key={t.id} task={t} {...props} />)}</div></section>}
      {active.length    > 0 && <section><SectionHeader icon={RiFireLine}            label="In Progress" count={active.length}    color="#f59e0b" /><div className="space-y-3">{active.map((t)    => <TaskCard key={t.id} task={t} {...props} />)}</div></section>}
      {pending.length   > 0 && <section><SectionHeader icon={RiTimeLine}            label="Upcoming"    count={pending.length}   color="#5a63f5" /><div className="space-y-3">{pending.map((t)   => <TaskCard key={t.id} task={t} {...props} />)}</div></section>}
      {completed.length > 0 && <section><SectionHeader icon={RiCheckboxCircleLine} label="Completed"   count={completed.length} color="#10b981" /><div className="space-y-3">{completed.map((t) => <TaskCard key={t.id} task={t} {...props} />)}</div></section>}
    </div>
  );
}
