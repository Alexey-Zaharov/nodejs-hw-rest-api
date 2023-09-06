const express = require("express");
const router = express.Router();
const contactsCntrl = require("../../controller");
const authMdlw = require("../../middlewares/auth");

router.get("/", authMdlw.auth, contactsCntrl.get);

router.get("/:contactId", authMdlw.auth, contactsCntrl.getById);

router.post("/", authMdlw.auth, contactsCntrl.add);

router.delete("/:contactId", authMdlw.auth, contactsCntrl.remove);

router.put("/:contactId", authMdlw.auth, contactsCntrl.update);

router.patch("/:contactId/favorite", contactsCntrl.update);

module.exports = router;
