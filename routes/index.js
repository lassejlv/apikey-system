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
  ApiKey.findOne({ key: req.query.token }, (err, apiKey) => {
    if (err) {
      console.log(err);
    } else {
      if (apiKey) {
        res.render("check", {
          token: apiKey.key,
          valid: true,
          created: moment(apiKey.createdAt).format("Do MMMM YYYY"),
        });
      } else {
        res.redirect("/");
      }
    }
  });
});

router.get("*", (req, res) => {
  res.render("404");
});

module.exports = router;
