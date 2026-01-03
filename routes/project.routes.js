const express = require("express");
const router = express.Router();
const {
  addProject,
  allProjects,
  deleteProject,
  findprojectById,
} = require("../controllers/projects.controller");

router.post("/projects", addProject);
router.get("/projects", allProjects);
router.delete("/projects", deleteProject);
router.get("/projects/:id", findprojectById);

module.exports = router;
