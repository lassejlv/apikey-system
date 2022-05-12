const router = require("express").Router();
const { generate } = require("yourid");
const ApiKey = require("../models/ApiKey");

router.get("/", (req, res) => {
  res.send({
    message:
      "Welcome to the API, to get access to the API, you will need an access token.",
    status: 200,
  });
});

router.post("/create", (req, res) => {
  const { email } = req.body;

  const createNewApiKey = new ApiKey({
    key: generate({ length: 20, keyspace: "0123456789" }),
    email,
  });

  createNewApiKey.save((err, apiKey) => {
    if (err) {
      res.send({
        message: "Error creating API key",
        status: 500,
      });
    } else {
      req.flash("message", `API key created! <strong>${apiKey.key}</strong>`);
      res.redirect("/");
    }
  });
});

router.get("/random", (req, res) => {
  let random = ["Facebook is cool", "Twitter is cool", "Instagram is cool"];

  let randomData = Math.floor(Math.random() * random.length);

  const { token } = req.query;

  if (token) {
    ApiKey.findOne({ key: token }, (err, apiKey) => {
      if (err) {
        res.send({
          message: "Error finding API key",
          status: 500,
        });
      } else {
        if (apiKey) {
          res.send({
            message: random[randomData],
            status: 200,
          });
        } else {
          res.send({
            message: "Invalid API key",
            status: 401,
          });
        }
      }
    });
  } else {
    res.send({
      message: "Please provide an API key",
      status: 401,
    });
  }
});

module.exports = router;
