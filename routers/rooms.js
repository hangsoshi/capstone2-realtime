const { Router } = require("express");
const { byId } = require("../controllers/rooms");

const router = Router();

router.get("/:id", byId);

module.exports = router;
