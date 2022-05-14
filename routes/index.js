const router = require("express").Router();

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

router.get("*", (req, res) => {
  res.render("404");
});

module.exports = router;
