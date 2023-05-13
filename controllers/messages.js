const { messages } = require("../models");

const messageOfUser = async (req, res) => {
  const { id, senderId } = req.params;
  const mess = await messages.findAll({
    where: {
      from_id: senderId,
      to_id: id,
    },
  });
  return res.status(200).json(mess);
};

const messageOfRooom = async (req, res) => {
  const { roomId } = req.params;
  const mess = await messages.findAll({
    where: {
      room_id: roomId,
    },
  });
  return res.status(200).json(mess);
};

const messageService = {
  messageOfUser,
  messageOfRooom,
};

module.exports = messageService;
