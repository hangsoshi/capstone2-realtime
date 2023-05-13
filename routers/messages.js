const { Router } = require("express");
const { messageOfUser, messageOfRooom } = require("../controllers/messages");

const router = Router();

router.get("/:id/sender/:senderId", messageOfUser);
router.get("/:roomId/room", messageOfRooom);

module.exports = router;
