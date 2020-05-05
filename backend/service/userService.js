const { User } = require("../models/models");

const user = {
  create: async (user) => {
    try {
      const existingUser = await User.findOne({
        where: {
          username: user.username,
          email: user.email,
        },
      });

      if (!existingUser) {
        const createdUser = await User.create(user);
        return createdUser;
      } else {
        return undefined;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },
  search: async (email) => {
    try {
      const foundUser = await User.findOne({
        where: {
          email: email,
        },
      });

      return foundUser;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

module.exports = user;
