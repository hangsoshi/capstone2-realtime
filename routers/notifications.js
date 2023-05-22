const { Router } = require("express");
const { changeStatus } = require("../controllers/notifications");

const router = Router();

router.put("/", changeStatus);

module.exports = router;
