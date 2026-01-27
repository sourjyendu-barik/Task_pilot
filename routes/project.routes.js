const express = require("express");
const router = express.Router();
const {
  addProject,
  allProjects,
  deleteProject,
  findprojectById,
  updateProjectById,
} = require("../controllers/projects.controller");

router.post("/projects", addProject);
router.get("/projects", allProjects);
router.delete("/projects/:id", deleteProject);
router.get("/projects/:id", findprojectById);
router.post("/projects/:id", updateProjectById);
module.exports = router;
