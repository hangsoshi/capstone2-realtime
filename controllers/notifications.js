const { notification } = require("../models");

const changeStatus = async (req, res) => {
  const { id, value } = req.body;
  await notification.update(
    {
      status: value,
    },
    {
      where: {
        id,
      },
    }
  );
  return res.status(200).json("Success");
};

const notificationController = {
  changeStatus,
};

module.exports = notificationController;
