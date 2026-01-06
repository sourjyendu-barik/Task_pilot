const express = require("express");
const router = express.Router();
const {
  lastWeekReport,
  pendingReport,
} = require("../controllers/report.controller");

router.get("/report/last-week", lastWeekReport);
router.get("/report/pending", pendingReport);

module.exports = router;
