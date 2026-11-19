const { Notification, User } = require("../models");

const createNewProductNotifications = async (product) => {
  const customers = await User.findAll({
    attributes: ["id"],
    where: {
      role: "customer",
      isBlocked: false,
    },
    raw: true,
  });

  if (!customers.length) return;

  const notifications = customers.map((customer) => ({
    userId: customer.id,
    type: "NEW_PRODUCT",
    title: "New Product Available!",
    message: `${product.name} has been added to our store. Check it out!`,
    productId: product.id,
  }));

  await Notification.bulkCreate(notifications);
};

module.exports = {
  createNewProductNotifications,
};