const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const auth = require("./routes/authRoutes");

const app = express();
app.use(cors());
const server = require("http").server();

const dbConfig = require("./config/secret");

const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(cookieParser());
mongoose.Promise = global.Promise;
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
  })
  .then((conn) => {
    console.log("mongodb connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("api/resetpassword", auth);

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
