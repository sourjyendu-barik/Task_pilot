const express = require("express");
const router = express.Router();
const { allUsers ,findUserById} = require("../controllers/user.controller");

router.get("/auth/users", allUsers);
router.get("/auth/users/:id", findUserById);

module.exports = router;
