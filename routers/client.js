const { Router } = require("express");
const userRoute = require("./users");
const messageRoute = require("./messages");
const roomRoute = require("./rooms");
const tourRoute = require("./tours");

const router = Router();

router.use("/users", userRoute);
router.use("/messages", messageRoute);
router.use("/rooms", roomRoute);
router.use("/tours", tourRoute);

module.exports = router;
