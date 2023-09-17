const express = require("express");
const router = express.Router();
const usersCntrl = require("../../controller");
const { auth, upload } = require("../../middlewares");

router.get("/current", auth, usersCntrl.currUser);
router.get("/verify/:verificationToken", auth, usersCntrl.verifiedUser);
router.post("/verify/", auth, usersCntrl.emailReSend);
router.post("/register", usersCntrl.addUser);
router.post("/login", usersCntrl.logInUser);
router.post("/logout", auth, usersCntrl.logOutUser);
router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  usersCntrl.updateUserAvatar
);

module.exports = router;
