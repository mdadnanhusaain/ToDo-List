import { Router } from "express";
import {
  createTask,
  getTodayTasks,
  getWeeklySummary,
  getAllTasks,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  searchTasks,
} from "../controllers/taskController.js";

const router = Router();

// summary & filters
router.get("/today", getTodayTasks);
router.get("/summary/week", getWeeklySummary);
router.get("/search", searchTasks);

// basic CRUD
router.get("/", getAllTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/toggle", toggleTaskStatus);

export default router;
