const { Op } = require("sequelize");
const { messages, friends, users, members, rooms } = require("../models");

module.exports = async (io) => {
  const connectedUser = {};
  io.on("connection", (socket) => {
    console.log(`----------- user connection ${socket.id}`);

    const userId = socket.handshake.auth.token;

    connectedUser[userId] = socket;

    socket.on("join-room", ({ roomId }) => {
      socket.join(`room-${roomId}`);
    });

    socket.on("chat-room", async ({ roomId, message }) => {
      const user = await users.findByPk(userId);
      const mess = await messages.create({
        from_id: userId,
        room_id: roomId,
        content: message,
      });
      io.to(`room-${roomId}`).emit("chat-room", {
        message: mess.content,
        sender: userId,
        name: user.name,
      });
    });

    socket.on("send-message", async ({ receiver, message, t }) => {
      const user = await users.findByPk(userId);
      const create = {
        from_id: userId,
        content: message,
        to_id: receiver,
      };
      const messageObject = await messages.create(create);
      if (connectedUser[receiver]) {
        connectedUser[receiver].emit("receive-message", {
          message: messageObject.content,
          name: user.name,
        });
      }
    });

    socket.on("friends", async () => {
      const yourFriends = await friends.findAll({
        where: {
          [Op.or]: [{ user_id: userId }, { friend_id: userId }],
        },
        attributes: ["user_id", "friend_id"],
      });
      const yourFriendInfos = await Promise.all(
        yourFriends.map(async (people) => {
          if (people.user_id === Number(userId)) {
            return await users.findByPk(people.friend_id);
          }
          if (people.friend_id === Number(userId)) {
            return await users.findByPk(people.user_id);
          }
        })
      );
      socket.emit("friends", yourFriendInfos);
    });

    socket.on("rooms", async () => {
      const yourRooms = await members.findAll({
        where: {
          user_id: userId,
          is_confirm: true,
        },
      });
      const yourRoomInfos = await Promise.all(
        yourRooms.map(async (room) => await rooms.findByPk(room.room_id))
      );
      socket.emit("rooms", yourRoomInfos);
    });

    socket.on("disconnect", () => {
      console.log(`----------- user disconnect ${socket.id}`);
    });
  });
};
