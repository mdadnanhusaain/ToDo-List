import { request } from "./client";

export const getTodayTasks = () => request("/tasks/today");

export const getTasksByDate = (date) => {
  const dateStr =
    date instanceof Date ? date.toISOString().split("T")[0] : date;
  return request(`/tasks/by-date?date=${encodeURIComponent(dateStr)}`);
};

export const getWeeklySummary = (date) => {
  const dateStr = date
    ? date instanceof Date
      ? date.toISOString().split("T")[0]
      : date
    : null;
  const url = dateStr
    ? `/tasks/summary/week?date=${encodeURIComponent(dateStr)}`
    : "/tasks/summary/week";
  return request(url);
};

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
