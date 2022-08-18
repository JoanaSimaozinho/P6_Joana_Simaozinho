const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const passwordCheck = require("../middleware/password");

// route pour le login et le signup : user.
router.post("/signup", passwordCheck, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;