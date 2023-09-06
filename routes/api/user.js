const express = require("express");
const router = express.Router();
const usersCntrl = require("../../controller");
const authMdlw = require("../../middlewares/auth");

router.get("/current", authMdlw.auth, usersCntrl.currUser);
router.post("/register", usersCntrl.addUser);
router.post("/login", usersCntrl.logInUser);
router.post("/logout", authMdlw.auth, usersCntrl.logOutUser);

module.exports = router;
