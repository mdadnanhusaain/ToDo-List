import { Router } from "express";
import {
  createTask,
  getTodayTasks,
  getTasksByDate,
  getWeeklySummary,
  getAllTasks,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  searchTasks,
} from "../controllers/taskController.js";

const router = Router();

router.get("/today", getTodayTasks);
router.get("/by-date", getTasksByDate);
router.get("/summary/week", getWeeklySummary);
router.get("/search", searchTasks);

router.get("/", getAllTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/toggle", toggleTaskStatus);

export default router;
