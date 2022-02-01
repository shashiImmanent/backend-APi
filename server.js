require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const app = express();

//configuration
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(express.json());

// db connection
mongoose
  .connect("mongodb://localhost:27017/mern-auth_Api")
  .then((data) => {
    console.log(`server is connected to db`);
  })
  .catch((err) => {
    console.log("No connection");
  });

//checking
app.get("/", (req, res) => {
  res.send("server is working");
});
//routes
app.use("/users", require("./routes/users"));


// server
const port = process.env.PORT || 6006;
app.listen(port, () => {
  console.log(`server runinng on the: ${port} `);
});
