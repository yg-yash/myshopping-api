const express = require("express");
const router = new express.Router();

const UserController = require("../controllers/user");
const auth = require("../middleware/check-auth");
//sing up
router.post("/signup", UserController.user_signUp);
//login
router.post("/login", UserController.user_Login);

//delete
router.delete("/delete", auth, UserController.user_deleted);

module.exports = router;
