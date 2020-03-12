const express = require("express");
const router = require("./routes/routes");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());
app.use("/api", router);

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
