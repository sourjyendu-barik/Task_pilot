const Project = require("../models/model.project");
const mongoose = require("mongoose");
const addProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({
        message: "Project name is required.",
        success: false,
      });
    }
    const exists = await Project.findOne({ name });
    if (exists) {
      return res.status(409).json({
        message: "This project is already exists.",
        success: false,
      });
    }
    const newproject = new Project({ name, description });
    await newproject.save();
    return res.status(201).json({
      message: "New project created successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This project is already exists.",
        success: false,
      });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "At least one of the fields is missing in project.",
        success: false,
      });
    }
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

const allProjects = async (req, res) => {
  try {
    const allProjectsList = await Project.find();
    return res.status(200).json({
      message: allProjectsList.length
        ? "Projects data found"
        : "No projects data available",
      success: true,
      data: allProjectsList,
      length: allProjectsList.length,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        message: "The project id is invalid",
        success: false,
      });
    }
    const deletedProject = await Project.findByIdAndDelete(projectId);
    if (!deletedProject) {
      return res.status(404).json({
        message: "The project is not found",
        success: false,
      });
    }
    return res
      .status(200)
      .json({ message: "The project is deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

const findprojectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res
        .status(400)
        .json({ success: false, message: "The project id is invalid" });
    }
    const requiredProject = await Project.findById(projectId);
    if (!requiredProject) {
      return res
        .status(404)
        .json({ message: "The project data is not found", success: false });
    }
    return res.status(200).json({
      message: "The project data is found",
      success: true,
      data: requiredProject,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

module.exports = { addProject, allProjects, deleteProject, findprojectById };
