// routes/report.routes.js
const express = require("express");
const router = express.Router();

const {
  lastWeekReport,
  pendingReport,
  getClosedTasksReport,
} = require("../controllers/report.controller");

// Weekly completed tasks
// GET /dashboard/report/last-week
router.get("/report/last-week", lastWeekReport);

// Pending work
// GET /dashboard/report/pending
router.get("/report/pending", pendingReport);

// Closed tasks grouped by team/owners/project
// GET /dashboard/report/closed-tasks?groupBy=team|owners|project
router.get("/report/closed-tasks", getClosedTasksReport);

module.exports = router;
