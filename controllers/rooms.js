const { rooms } = require("../models");

const byId = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const room = await rooms.findByPk(id);
  return res.status(200).json(room);
};

const roomService = {
  byId,
};

module.exports = roomService;
