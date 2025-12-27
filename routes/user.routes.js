const express = require("express");
const router = express.Router();
const {
  addNewUser,
  authLogin,
  allUsers,
} = require("../controllers/user.controller");
router.post("/auth/signup", addNewUser);
router.post("/auth/login", authLogin);
router.get("/auth/users", allUsers);
module.exports = router;
