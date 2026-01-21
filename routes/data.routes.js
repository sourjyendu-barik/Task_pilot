const express = require("express");
const router = express.Router();
const {
  getUserProjects,
  getsTasksByUsers,
} = require("../controllers/dataById.controller");
router.get("/auth/projects/user/:id", getUserProjects);
router.get("/auth/tasks/user/:id", getsTasksByUsers);
module.exports = router;
