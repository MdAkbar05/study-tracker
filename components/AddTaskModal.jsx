// components/AddTaskModal.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import {
  RiCloseLine, RiAddLine, RiSaveLine,
  RiBookLine, RiFileTextLine, RiTestTubeLine, RiMedalLine, RiQuillPenLine,
} from "react-icons/ri";
import { TASK_TYPES, TASK_TYPE_LABELS, TASK_TYPE_COLORS } from "@/lib/constants";

const TYPE_ICONS = {
  [TASK_TYPES.CLASS_TOPIC]: RiBookLine,
  [TASK_TYPES.ASSIGNMENT]:  RiQuillPenLine,
  [TASK_TYPES.LAB_REPORT]:  RiTestTubeLine,
  [TASK_TYPES.EXAM]:        RiMedalLine,
  [TASK_TYPES.CLASS_TEST]:  RiFileTextLine,
};

const defaultForm = { title: "", description: "", deadline: "", type: TASK_TYPES.ASSIGNMENT };

export default function AddTaskModal({ isOpen, onClose, onSubmit, editTask }) {
  const [form,   setForm]   = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const titleRef = useRef(null);
  const isEditing = Boolean(editTask);

  useEffect(() => {
    if (!isOpen) return;
    if (editTask) {
      const dl = new Date(editTask.deadline);
      const p  = (n) => String(n).padStart(2, "0");
      const localDT = `${dl.getFullYear()}-${p(dl.getMonth()+1)}-${p(dl.getDate())}T${p(dl.getHours())}:${p(dl.getMinutes())}`;
      setForm({ title: editTask.title, description: editTask.description || "", deadline: localDT, type: editTask.type });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
    setSaving(false);
    setTimeout(() => titleRef.current?.focus(), 120);
  }, [isOpen, editTask]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.deadline)     errs.deadline = "Deadline is required";
    else if (!isEditing && new Date(form.deadline) < new Date())
      errs.deadline = "Deadline must be in the future";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      setSaving(true);
      await onSubmit({ ...form, deadline: new Date(form.deadline).toISOString() });
      onClose();
    } catch (err) {
      setErrors({ submit: err.message || "Failed to save task" });
    } finally {
      setSaving(false);
    }
  };

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined, submit: undefined }));
  };

  if (!isOpen) return null;

  const nowLocal = (() => {
    const d = new Date(); d.setSeconds(0, 0);
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
  })();

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl animate-slide-in overflow-hidden"
        style={{ backgroundColor: "var(--bg-card)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-ink-600 flex items-center justify-center">
              {isEditing ? <RiSaveLine className="text-white text-sm" /> : <RiAddLine className="text-white text-sm" />}
            </div>
            <h2 className="font-display font-bold text-base" style={{ color: "var(--text-primary)" }}>
              {isEditing ? "Edit Task" : "New Task"}
            </h2>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer border-none"
            style={{ color: "var(--text-secondary)", backgroundColor: "transparent" }}>
            <RiCloseLine className="text-lg" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {errors.submit && (
            <div className="text-xs font-medium px-3 py-2.5 rounded-xl"
              style={{ backgroundColor: "rgba(244,63,94,0.1)", color: "#f43f5e", border: "1px solid rgba(244,63,94,0.2)" }}>
              {errors.submit}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Task Title <span style={{ color: "#f43f5e" }}>*</span>
            </label>
            <input ref={titleRef} type="text" placeholder="e.g. Complete Chapter 5 notes"
              value={form.title} onChange={set("title")} className="input-field"
              style={errors.title ? { borderColor: "#f43f5e", boxShadow: "0 0 0 3px rgba(244,63,94,0.15)" } : {}}
            />
            {errors.title && <p className="text-xs mt-1" style={{ color: "#f43f5e" }}>{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Description <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea placeholder="Add details…" value={form.description} onChange={set("description")}
              rows={3} className="input-field resize-none" />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Due Date &amp; Time <span style={{ color: "#f43f5e" }}>*</span>
            </label>
            <input type="datetime-local" min={nowLocal} value={form.deadline} onChange={set("deadline")}
              className="input-field"
              style={errors.deadline ? { borderColor: "#f43f5e", boxShadow: "0 0 0 3px rgba(244,63,94,0.15)" } : {}}
            />
            {errors.deadline && <p className="text-xs mt-1" style={{ color: "#f43f5e" }}>{errors.deadline}</p>}
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
              Task Type <span style={{ color: "#f43f5e" }}>*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.values(TASK_TYPES).map((val) => {
                const Icon   = TYPE_ICONS[val];
                const colors = TASK_TYPE_COLORS[val] || { accent: "#8b5cf6" };
                const selected = form.type === val;
                return (
                  <button key={val} type="button" onClick={() => setForm((f) => ({ ...f, type: val }))}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all duration-200 active:scale-95 cursor-pointer"
                    style={selected
                      ? { backgroundColor: `${colors.accent}18`, border: `2px solid ${colors.accent}`, color: colors.accent }
                      : { backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-secondary)" }
                    }>
                    <Icon className="text-base flex-shrink-0" />
                    <span className="text-xs font-semibold leading-tight">{TASK_TYPE_LABELS[val]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 flex gap-2" style={{ borderTop: "1px solid var(--border)" }}>
          <button onClick={onClose} className="btn-ghost flex-1 text-sm" disabled={saving}>Cancel</button>
          <button onClick={handleSubmit} disabled={saving}
            className="btn-primary flex-1 text-sm justify-center"
            style={{ opacity: saving ? 0.7 : 1 }}>
            {saving ? (
              <><span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" /> Saving…</>
            ) : (
              <>{isEditing ? <RiSaveLine /> : <RiAddLine />} {isEditing ? "Save Changes" : "Add Task"}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
