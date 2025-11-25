import { request } from "./client";

export const getTodayTasks = () => request("/tasks/today");

export const getWeeklySummary = () => request("/tasks/summary/week");

export const getAllTasks = () => request("/tasks");

export const createTask = (payload) =>
  request("/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const toggleTaskStatus = (id) =>
  request(`/tasks/${id}/toggle`, { method: "PATCH" });

export const deleteTask = (id) => request(`/tasks/${id}`, { method: "DELETE" });

export const updateTask = (id, payload) =>
  request(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const searchTasks = (q) =>
  request(`/tasks/search?q=${encodeURIComponent(q)}`);
