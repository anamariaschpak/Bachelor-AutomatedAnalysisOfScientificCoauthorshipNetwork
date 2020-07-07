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

      if (existingUser === null) {
        const createdUser = await User.create(user);
        return createdUser;
      } else {
        return undefined;
      }
    } catch (error) {
      console.log(error.message);
    }
  },
  search: async (user) => {
    try {
      const foundUser = await User.findOne({
        where: {
          email: user.email,
        },
      });

      return foundUser;
    } catch (error) {
      console.log(error.message);
    }
  },
};

module.exports = user;
