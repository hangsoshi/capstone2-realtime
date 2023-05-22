const { Router } = require("express");
const userRoute = require("./users");
const messageRoute = require("./messages");
const roomRoute = require("./rooms");
const tourRoute = require("./tours");
const notificationRoute = require("./notifications");

const router = Router();

router.use("/users", userRoute);
router.use("/messages", messageRoute);
router.use("/rooms", roomRoute);
router.use("/tours", tourRoute);
router.use("/notifications", notificationRoute);

module.exports = router;
