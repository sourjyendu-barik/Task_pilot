const express = require("express");
const router = express.Router();
const {
  addTeam,
  getTeam,
  deleteTeam,
} = require("../controllers/teams.controller");

router.post(`/teams`, addTeam);
router.get(`/teams/:id`, getTeam);
router.delete(`/teams/:id`, deleteTeam);

module.exports = router;
