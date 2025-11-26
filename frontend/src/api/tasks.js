import { request } from "./client";

export const getTodayTasks = () => request("/tasks/today");

export const getTasksByDate = (date) => {
  let dateStr;
  if (date instanceof Date) {
    // Use local date components to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    dateStr = `${year}-${month}-${day}`;
  } else {
    dateStr = date;
  }
  return request(`/tasks/by-date?date=${encodeURIComponent(dateStr)}`);
};

export const getWeeklySummary = (date) => {
  let dateStr = null;
  if (date) {
    if (date instanceof Date) {
      // Use local date components to avoid timezone issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      dateStr = `${year}-${month}-${day}`;
    } else {
      dateStr = date;
    }
  }
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
