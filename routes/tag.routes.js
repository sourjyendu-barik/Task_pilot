const express = require("express");
const router = express.Router();
const {
  addTag,
  alltags,
  deleteTagById,
} = require("../controllers/tags.controller");

router.get("/tags", alltags);
router.post("/tags", addTag);
router.delete("/tags/:id", deleteTagById);
module.exports = router;
