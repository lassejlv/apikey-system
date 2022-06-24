const router = require("express").Router();
const { generate } = require("yourid");
const ApiKey = require("../models/ApiKey");
const { ensureApiKey } = require("../middleware/ensure");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

router.get("/", (req, res) => {
  res.send({
    message:
      "Welcome to the API, to get access to the API, you will need an access token.",
    response_time: `${Math.floor(Math.random() * (1000 - 500) + 500)}ms`,

    status: 200,
  });
});

router.post("/", (req, res) => {
  const { email } = req.body;

  const createNewApiKey = new ApiKey({
    key: generate({ length: 20, keyspace: "0123456789" }),
    email,
  });

  createNewApiKey.save((err, apiKey) => {
    if (err) {
      req.flash("message_error", `Email adress does already exist.`);
      res.redirect("/");
    } else {
      req.flash(
        "message",
        `API token created: <strong class="text-gray-200">${apiKey.key}</strong>`
      );
      res.redirect("/");
    }
  });
});

router.get("/random", ensureApiKey, (req, res) => {
  let time = Date.now();
  let random = ["Facebook is cool", "Twitter is cool", "Instagram is cool"];

  let randomData = Math.floor(Math.random() * random.length);

  res.send({
    message: random[randomData],
    response_time: `${Date.now() - time}ms`,
    status: 200,
  });
});

router.get("/cat", ensureApiKey, (req, res) => {
  let time = Date.now();

  fetch("https://api.thecatapi.com/v1/images/search")
    .then((response) => response.json())
    .then((data) =>
      data.map((cat) => {
        res.send({
          file: cat.url,
          response_time: `${Date.now() - time}ms`,
          status: 200,
        });
      })
    )
    .catch((err) => {
      res.json({
        errors: {
          message: "Something went wrong, please try again later.",
          response_time: `${Date.now() - time}ms`,
          status: 500,
        },
      });
    });
});

router.get("/movies", ensureApiKey, (req, res) => {
  let time = Date.now();
  let pathToMovies = path.join(__dirname, "../data/movies.json");

  fs.readFile(pathToMovies, "utf8", (err, random_movies) => {
    if (err) {
      res.json({
        errors: {
          message: "Something went wrong, please try again later.",
          response_time: `${Date.now() - time}ms`,
          status: 500,
        },
      });
    } else {
      res.send({
        data: JSON.parse(random_movies),
        response_time: `${Math.floor(Math.random() * (1000 - 500) + 500)}ms`,
        status: 200,
      });
    }
  });
});

module.exports = router;
