const { User } = require("../models/models");

const user = {
  create: async user => {
    try {
      const createdUser = await User.create(user);

      return createdUser;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  authenticate: async (username, password) => {
    try {
      const authenticatedUser = await User.findOne({
        where: {
          username: username,
          password: password
        }
      });

      return authenticatedUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

module.exports = user;
