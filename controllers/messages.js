const { messages, users } = require("../models");

const messageOfUser = async (req, res) => {
  const { id, senderId } = req.params;
  const mess = await messages.findAll({
    where: {
      from_id: senderId,
      to_id: id,
    },
  });
  const messWithProfile = await Promise.all(
    mess.map(async (m) => {
      const from = await users.findByPk(m.from_id);
      const to = await users.findByPk(m.to_id);
      return { ...m.dataValues, from_name: from.name, to_name: to.name };
    })
  );
  return res.status(200).json(messWithProfile);
};

const messageOfRooom = async (req, res) => {
  const { roomId } = req.params;
  const mess = await messages.findAll({
    where: {
      room_id: roomId,
    },
  });
  const messWithProfile = await Promise.all(
    mess.map(async (m) => {
      const from = await users.findByPk(m.from_id);
      console.log(from);
      return { ...m.dataValues, from_name: from.name };
    })
  );
  return res.status(200).json(messWithProfile);
};

const messageService = {
  messageOfUser,
  messageOfRooom,
};

module.exports = messageService;
