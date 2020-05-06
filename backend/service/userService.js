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
      // throw new Error("------Aici:" + error.message); => DO NOT uncomment this and DO NOT remove this comment => it causes ERROR
      console.log(error.message);
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
      // throw new Error(error.message);
      console.log(error.message);
    }
  },
};

module.exports = user;
