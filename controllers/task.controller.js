const Task = require("../models/model.task");
const mongoose = require("mongoose");

const createTask = async (req, res) => {
  try {
    let { name, project, team, owners, timeToComplete, dueDate } = req.body;
    timeToComplete = Number(timeToComplete);
    dueDate = new Date(dueDate);
    if (
      !name ||
      !project ||
      !team ||
      !Array.isArray(owners) ||
      owners.length === 0 ||
      Number.isNaN(timeToComplete) ||
      timeToComplete < 1 ||
      isNaN(dueDate.getTime())
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing field is there" });
    }
    if (
      !mongoose.Types.ObjectId.isValid(project) ||
      !mongoose.Types.ObjectId.isValid(team) ||
      !owners.every((o) => mongoose.Types.ObjectId.isValid(o))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid objectid in Team,Owners,or Project",
      });
    }
    const exist = await Task.findOne({ name });
    if (exist) {
      return res.status(409).json({
        success: false,
        message: "This task  already exists",
      });
    }

    const newTask = new Task({
      name,
      project,
      team,
      owners,
      timeToComplete,
      dueDate,
    });
    const savedTask = await newTask.save();
    return res.status(201).json({
      success: true,
      message: `${savedTask.name} saved successfully`,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Missing field is there" });
    }
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This task  already exists",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const readTasks = async (req, res) => {
  try {
    const allTasks = await Task.find().populate("project team owners");
    return res.status(200).json({
      success: true,
      data: allTasks,
      message: allTasks.length
        ? "Tasks data fetched successfully"
        : "No task data present",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const updateTaskById = async (req, res) => {
  try {
    const updatedTask = req.body;
    const taskId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res
        .status(400)
        .json({ success: false, message: "Task id is invalid." });
    }
    const savedUpdatedTask = await Task.findByIdAndUpdate(taskId, updatedTask, {
      new: true,
      runValidators: true,
    });
    if (!savedUpdatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task data not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: `${savedUpdatedTask.name} saved successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const deleteTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res
        .status(400)
        .json({ success: false, message: "Task id is invalid." });
    }
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: "Task data not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: `${deletedTask.name} is deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const getTasksById = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res
        .status(400)
        .json({ success: false, message: "Task id is invalid." });
    }
    const taskDetail = await Task.findById(taskId).populate(
      "project team owners"
    );
    if (!taskDetail) {
      return res.status(404).json({
        success: false,
        message: "Task data not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: `data fetched successfully`,
      data: taskDetail,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
module.exports = {
  createTask,
  readTasks,
  updateTaskById,
  deleteTaskById,
  getTasksById,
};
