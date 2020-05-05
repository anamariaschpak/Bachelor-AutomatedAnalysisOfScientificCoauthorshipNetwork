const express = require("express");
const router = require("./routes/routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models/models");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());
app.use("/api", router);

// app.post("/api/auth", (request, response) => {
//   let user = db.User.findAll().then((users) => {
//     users.filter((user) => {
//       return (
//         user.name == request.body.name &&
//         user.email == request.body.email &&
//         user.password == request.body.password
//       );
//     });
//   });

//   if (user.length) {
//     let tokenPayload = {
//       name: user[0].name,
//       email: user[0].email,
//       password: user[0].password,
//     };

//     let token = jwt.sign(tokenPayload, "jwtSecretPassword", {
//       expiresIn: "2h",
//     });

//     let res = {
//       message: "Token Created, Authentication Successful!",
//       token: token,
//     };

//     return response.status(200).json(res);
//   } else {
//     return response
//       .status("409")
//       .json("Authentication failed, User not found!");
//   }
// });

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
