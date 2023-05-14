const { Router } = require("express");
const { getTourById } = require("../controllers/tours");

const router = Router();

router.get("/:id", getTourById);

module.exports = router;
