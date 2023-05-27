const { rooms, users, members, notification } = require("../models");

module.exports = (io) => {
  let connectUsers = {};

  io.on("connection", (socket) => {
    console.log(`------- user connection ${socket.id}`);

    const userId = socket.handshake.auth.token;

    connectUsers[userId] = socket;

    socket.on("load", async (id) => {
      const notifications = await notification.findAll({
        where: {
          receiver_id: id,
          status: false,
        },
      });
      connectUsers[id].emit("load", notifications);
    });

    const existing = (id) => {
      if (connectUsers[id]) {
        return true;
      } else {
        return false;
      }
    };

    socket.on("verify-join-room", async ({ id, value }) => {
      await members.update(
        {
          is_confirm: value,
        },
        {
          where: {
            id,
          },
        }
      );
      const member = await members.findByPk(id);
      const room = await rooms.findByPk(member?.room_id);
      // create new notification on database
      notification.create({
        receiver_id: member.user_id,
        content: value
          ? "Bạn đã được xác nhận tham gia vào nhóm"
          : "Yêu cầu tham gia nhóm của bạn bị từ chối",
      });
      if (existing(member.user_id)) {
        console.log(connectUsers[member.user_id]);
        connectUsers[member.user_id].emit("verify-join-room", {
          message: value
            ? "Bạn đã được xác nhận tham gia vào nhóm"
            : "Yêu cầu tham gia nhóm của bạn bị từ chối",
          room: room.name,
        });
      }
    });

    socket.on("join-room", async ({ roomId, joiner }) => {
      const room = await rooms.findByPk(roomId);
      const countExistingMember = await members.count({
        where: {
          room_id: roomId,
          is_confirm: true,
        },
      });
      if (countExistingMember < room.slot) {
        const member = await members.findOne({
          where: {
            user_id: joiner,
            room_id: roomId,
          },
        });
        if (member) {
          socket.emit("join-room-response", {
            message: "Bạn đã đăng ký tham gia",
            status: "warning",
          });
        } else {
          const newMember = await members.create({
            user_id: joiner,
            room_id: roomId,
            is_confirm: false,
          });
          const user = await users.findByPk(joiner);
          if (connectUsers[room.room_owner]) {
            const notify = await notification.create({
              receiver_id: room.room_owner,
              content: `${user.name} đang muốn tham gia vào phòng của bạn {${newMember.id}}`,
              type: "verify",
            });
            connectUsers[room.room_owner].emit("join-room", {
              who: user.name,
              message: `đang muốn tham gia vào phòng của bạn`,
              verifyId: newMember.id,
              notiid: notify.id,
            });
            socket.emit("join-room-response", {
              message: "Đăng ký tham gia thành công",
              status: "success",
            });
          }
        }
      } else {
        socket.emit("join-room-response", {
          message: "Phòng đầy",
          status: "error",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`----------- user disconnect ${socket.id}`);
      delete connectUsers[userId];
    });
  });
};
