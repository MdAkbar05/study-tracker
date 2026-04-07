// hooks/useTasks.js — fetches from /api/tasks, CRUD requires admin token
"use client";
import { useState, useEffect, useCallback } from "react";
import { sortTasks } from "@/lib/utils";
import { useAuth } from "./useAuth";

export function useTasks() {
  const { token } = useAuth();
  const [tasks,  setTasks]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,  setError]  = useState(null);

  // ── Fetch all tasks ────────────────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/tasks");
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setTasks(json.data);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const authHeaders = () => ({
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });

  // ── Add task ───────────────────────────────────────────────────────────────
  const addTask = useCallback(async (data) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    setTasks((prev) => [...prev, json.data]);
    return json.data;
  }, [token]);

  // ── Update task ────────────────────────────────────────────────────────────
  const updateTask = useCallback(async (id, data) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    setTasks((prev) => prev.map((t) => (t.id === id ? json.data : t)));
    return json.data;
  }, [token]);

  // ── Delete task ────────────────────────────────────────────────────────────
  const deleteTask = useCallback(async (id) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, [token]);

  // ── Toggle complete ────────────────────────────────────────────────────────
  const toggleComplete = useCallback(async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    await updateTask(id, { completed: !task.completed, inProgress: false });
  }, [tasks, updateTask]);

  // ── Toggle in-progress ────────────────────────────────────────────────────
  const toggleInProgress = useCallback(async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    await updateTask(id, { inProgress: !task.inProgress, completed: false });
  }, [tasks, updateTask]);

  // ── Clear completed ────────────────────────────────────────────────────────
  const clearCompleted = useCallback(async () => {
    const completed = tasks.filter((t) => t.completed);
    await Promise.all(completed.map((t) => deleteTask(t.id)));
  }, [tasks, deleteTask]);

  return {
    tasks,
    sortedTasks: sortTasks(tasks),
    loading,
    error,
    refetch: fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    toggleInProgress,
    clearCompleted,
  };
}
