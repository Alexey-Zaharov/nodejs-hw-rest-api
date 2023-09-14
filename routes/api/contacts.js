const express = require("express");
const router = express.Router();
const contactsCntrl = require("../../controller");
const auth = require("../../middlewares/auth");

router.get("/", auth, contactsCntrl.get);

router.get("/:contactId", auth, contactsCntrl.getById);

router.post("/", auth, contactsCntrl.add);

router.delete("/:contactId", auth, contactsCntrl.remove);

router.put("/:contactId", auth, contactsCntrl.update);

router.patch("/:contactId/favorite", contactsCntrl.update);

module.exports = router;
