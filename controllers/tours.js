const { personal_tours } = require("../models");

const getTourById = async (req, res) => {
  const tour = await personal_tours.findByPk(req.params.id);
  return res.status(200).json(tour);
};

const tourController = {
  getTourById,
};

module.exports = tourController;
