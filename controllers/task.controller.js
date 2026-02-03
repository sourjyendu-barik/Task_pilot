const Task = require("../models/model.task");
const Tag = require("../models/model.tag");
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
// const readTasks = async (req, res) => {
//   try {
//     const { project, team, owner, tags, status } = req.query;
//     const filter = {};
//     const validateObjectId = (id, fieldName) => {
//       if (!!id && !mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({
//           success: false,
//           message: `Invalid ${fieldName}`,
//         });
//       }
//     };
//     const createMongooseId = (id) => {
//       return new mongoose.Types.ObjectId(id);
//     };
//     if (!!project) {
//       validateObjectId(project, "project");
//       filter.project = createMongooseId(project);
//     }
//     const allTasks = await Task.find(filter).populate("project team owners");
//     return res.status(200).json({
//       success: true,
//       data: allTasks,
//       message: allTasks.length
//         ? "Tasks data fetched successfully"
//         : "No task data present",
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };
const readTasks = async (req, res) => {
  try {
    const { project, team, owner, tags, status } = req.query;
    const filter = {};

    const createMongooseId = (id) => new mongoose.Types.ObjectId(id);

    const validateObjectId = (id, fieldName) => {
      if (!!id && !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: `Invalid ${fieldName} ID`,
        });
      }
      return true;
    };

    // Validate + filter for each field
    if (!!project) {
      if (!validateObjectId(project, "project")) return;
      filter.project = createMongooseId(project);
    }

    if (!!team) {
      if (!validateObjectId(team, "team")) return;
      filter.team = createMongooseId(team);
    }

    if (!!owner) {
      if (!validateObjectId(owner, "owner")) return;
      filter.owners = createMongooseId(owner);
    }

    if (!!status) filter.status = status;
    if (!!tags) filter.tags = tags;

    const allTasks = await Task.find(filter).populate("project team owners");

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
    const taskId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res
        .status(400)
        .json({ success: false, message: "Task id is invalid." });
    }
    const updatedTask = { ...req.body };
    if (Array.isArray(updatedTask.tags)) {
      const normalizedTags = [
        ...new Set(updatedTask.tags.map((t) => t?.trim()).filter(Boolean)),
      ];

      // Ensure tags exist in Tag collection
      if (normalizedTags.length > 0) {
        await Tag.insertMany(
          normalizedTags.map((name) => ({ name })),
          { ordered: false }, // ignore duplicates
        ).catch((err) => {
          if (err.code !== 11000) throw err;
        });
      }

      updatedTask.tags = normalizedTags;
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
      "project team owners",
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
