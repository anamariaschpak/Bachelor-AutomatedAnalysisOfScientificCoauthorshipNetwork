const { User } = require("../models/models");

const user = {
  create: async user => {
    try {
      const result = await User.create(user);

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

module.exports = user;
