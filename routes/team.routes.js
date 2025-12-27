const express = require("express");
const router = express.Router();
const {
  addTeam,
  getTeam,
  deleteTeam,
  addMember,
  deleteMember,
  allteams,
} = require("../controllers/teams.controller");

router.post(`/teams`, addTeam);
router.get(`/teams/:id`, getTeam);
router.delete(`/teams/:id`, deleteTeam);
router.get(`/teams`, allteams);
router.post(`/teams/member/:id`, addMember);
router.delete(`/teams/member/:id`, deleteMember);
module.exports = router;
