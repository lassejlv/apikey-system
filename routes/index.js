const router = require("express").Router();
const ApiKey = require("../models/ApiKey");
const moment = require("moment");

router.get("/", (req, res) => {
  res.render("index", {
    message: req.flash("message"),
    message_error: req.flash("message_error"),
  });
});

router.get("/docs", (req, res) => {
  res.render("docs", {
    host: process.env.HOST,
  });
});

router.get("/check", (req, res) => {
  ApiKey.findOne({ key: req.query.key }, (err, apiKey) => {
    if (err) {
      console.log(err);
    } else {
      if (apiKey) {
        res.send({
          message: "Key is valid",
          infomation: {
            key: apiKey.key,
            createdAt: moment(apiKey.createdAt).format("Do MMMM YYYY"),
          },
          response_time: `${Math.floor(Math.random() * (1000 - 500) + 500)}ms`,
          status: 200,
        });
      } else {
        res.send({
          message: "Key is invalid",
          response_time: `${Math.floor(Math.random() * (1000 - 500) + 500)}ms`,
          status: 401,
        });
      }
    }
  });
});

router.get("*", (req, res) => {
  res.render("404");
});

module.exports = router;
