const userService = require("../service/userService");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const createUser = async (request, response) => {
  const userFromRequestBody = request.body;

  if (
    userFromRequestBody.username &&
    userFromRequestBody.email &&
    userFromRequestBody.password
  ) {
    bcrypt.hash(userFromRequestBody.password, saltRounds, async function (
      error,
      hash
    ) {
      if (error) throw error;

      userFromRequestBody.password = hash;
      const result = await userService.create(userFromRequestBody);
      if (result) {
        response.status(200).json({
          message: "User entry succesfully created.",
        });
      } else {
        response.status(400).json({
          message:
            "User not created: user already exists with this email address or this username is taken!",
        });
      }
    });
  } else {
    response.status(400).json({
      message: "User not created: invalid user details!",
    });
  }
};

const authenticateUser = async (request, response) => {
  const userFromRequestBody = request.body;

  const userFromResponse = await userService.search(userFromRequestBody);

  if (userFromResponse) {
    bcrypt.compare(
      userFromRequestBody.password,
      userFromResponse.password,
      function (error, result) {
        if (error) throw error;

        if (result === true) {
          response.status(200).json({
            message: "User succesfully authenticated.",
          });
        } else {
          response.status(401).json({
            message: "The password you entered is incorrect!",
          });
        }
      }
    );
  } else {
    response.status(400).json({
      message:
        "User not found: the email you entered doesn't match any account!",
    });
  }
};

module.exports = { createUser, authenticateUser };
