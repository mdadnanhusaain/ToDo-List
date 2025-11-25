import Task from "../models/Task.js";
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns";

export const createTask = async (req, res) => {
  try {
    const { title, description, date, startTime, endTime, priority } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: "Title and date are required." });
    }

    const task = await Task.create({
      title,
      description,
      date: new Date(date),
      startTime,
      endTime,
      priority: priority || "medium",
    });

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create task" });
  }
};

export const getTodayTasks = async (_req, res) => {
  try {
    const today = new Date();
    const tasks = await Task.find({
      date: {
        $gte: startOfDay(today),
        $lte: endOfDay(today),
      },
    }).sort({ createdAt: 1 });

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch today tasks" });
  }
};

export const getWeeklySummary = async (req, res) => {
  try {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 0 }); // Sun
    const weekEnd = endOfWeek(today, { weekStartsOn: 0 });

    const tasks = await Task.aggregate([
      {
        $match: {
          date: { $gte: weekStart, $lte: weekEnd },
        },
      },
      {
        $group: {
          _id: null,
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
        },
      },
    ]);

    const summary = tasks[0] || { completed: 0, pending: 0 };
    res.json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch summary" });
  }
};

export const getAllTasks = async (_req, res) => {
  try {
    const tasks = await Task.find().sort({ date: 1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, startTime, endTime, priority, status } =
      req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = new Date(date);
    if (startTime !== undefined) updateData.startTime = startTime;
    if (endTime !== undefined) updateData.endTime = endTime;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;

    const task = await Task.findByIdAndUpdate(id, updateData, { new: true });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update task" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete task" });
  }
};

export const toggleTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = task.status === "completed" ? "pending" : "completed";
    await task.save();

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to toggle status" });
  }
};

export const searchTasks = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    // Use regex for case-insensitive search if text index is not available
    const searchRegex = new RegExp(q, "i");
    const tasks = await Task.find({
      $or: [{ title: searchRegex }, { description: searchRegex }],
    }).sort({ date: 1 });

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to search tasks" });
  }
};
