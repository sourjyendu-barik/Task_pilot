const express = require("express");
const router = express.Router();

const {
  createTask,
  readTasks,
  updateTaskById,
  deleteTaskById,
  getTasksById,
} = require("../controllers/task.controller");

router.post("/task", createTask);
router.get("/task", readTasks);
router.get("/task/:id", getTasksById);
router.post("/task/:id", updateTaskById);
router.delete("/task/:id", deleteTaskById);
module.exports = router;
