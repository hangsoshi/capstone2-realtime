const { Router } = require("express");
const userRoute = require("./users");
const messageRoute = require("./messages");
const roomRoute = require("./rooms");

const router = Router();

router.use("/users", userRoute);
router.use("/messages", messageRoute);
router.use("/rooms", roomRoute);

module.exports = router;
