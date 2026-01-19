const express = require("express");
const router = express.Router();
const {
  addNewUser,
  authLogin,
} = require("../controllers/authRoute.controller");

router.post("/auth/signup", addNewUser);
router.post("/auth/login", authLogin);

module.exports = router;
