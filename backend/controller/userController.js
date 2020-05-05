const userService = require("../service/userService");

const createUser = async (request, response) => {
  const userFromRequestBody = request.body;

  if (
    userFromRequestBody.username &&
    userFromRequestBody.email &&
    userFromRequestBody.password
  ) {
    // const createdUser =
    const result = await userService.create(userFromRequestBody);
    if (result) {
      response.status(200).json({
        message: "User entry succesfully created.",
      });
    } else {
      response.status(400).json({
        message: "User not created: user already exists!",
      });
    }
  } else {
    response.status(400).json({
      message: "User not created: invalid user details!",
    });
  }
};

const authenticateUser = async (request, response) => {
  const userFromRequestBody = request.body;
  // console.log(userFromRequestBody.username);

  const userFromResponse = await userService.search(userFromRequestBody.email);
  // console.log(userFromResponse.username);
  console.log(userFromResponse);
  if (userFromResponse) {
    if (
      userFromRequestBody.email === userFromResponse.email &&
      userFromRequestBody.password === userFromResponse.password
    ) {
      response.status(200).json({
        message: "User succesfully authenticated.",
      });
    } else {
      response.status(401).json({
        message: "The password you entered is incorrect!",
      });
    }
  } else {
    response.status(400).json({
      message:
        "User not found: the email you entered doesn't match any account!",
    });
  }
};

module.exports = { createUser, authenticateUser };
