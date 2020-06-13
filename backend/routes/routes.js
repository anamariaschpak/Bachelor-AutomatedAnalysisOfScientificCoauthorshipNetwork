const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");
const graphController = require("../controller/graphController");

router.post("/register", userController.createUser);
router.post("/login", userController.authenticateUser);
router.get("/getGraphData", graphController.getGraphData);
//If your login request is via a user supplying a username and password then a POST
// is preferable, as details will be sent in the HTTP messages body rather than the URL.
//Although it will still be sent plain text, unless you're encrypting via https.

module.exports = router;
