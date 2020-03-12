const userService = require("../service/userService");

const createUser = async (request, response) => {
  const userFromRequestBody = request.body;

  if (
    userFromRequestBody.username &&
    userFromRequestBody.email &&
    userFromRequestBody.password
  ) {
    // const createdUser =
    await userService.create(userFromRequestBody);
    response.status(200).json({
      message: "User entry succesfully created."
    });
  } else {
    response.status(400).json({
      message: "User not created: invalid user details!"
    });
  }
};

const authenticateUser = async (request, response) => {
  try {
    const userFromRequestBody = request.body;

    const userFromResponse = await userService.authenticate(
      userFromRequestBody.username,
      userFromRequestBody.password
    );
    if (
      userFromRequestBody.username === userFromResponse.username &&
      userFromRequestBody.password === userFromResponse.password
    ) {
      response.status(200).json({
        message: "User succesfully authenticated."
      });
    }
  } catch (error) {
    response.status(400).json({
      message: "User not found: " + error.message
    });
  }
};

module.exports = { createUser, authenticateUser };
