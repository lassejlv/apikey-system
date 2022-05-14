require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const flush = require("connect-flash");
const cors = require("cors");

// Database stuff

mongoose.connect(process.env.MONGO_URI, () => {
  console.log("Connected to MongoDB");
});

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "dsadas",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(flush());
app.use("/api", require("./routes/api"));
app.use("/", require("./routes/index"));

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 3000");
});
