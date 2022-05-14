const ApiKey = require("../models/ApiKey");

module.exports = {
  ensureApiKey: function (req, res, next) {
    const { token } = req.query;

    if (token) {
      ApiKey.findOne({ key: token }, (err, apiKey) => {
        if (err) {
          res.send({
            errors: {
              message: "Error finding API token",
              status: 500,
            },
          });
        } else {
          if (apiKey) {
            next();
          } else {
            res.send({
              errors: {
                message: "Invalid API token",
                status: 401,
              },
            });
          }
        }
      });
    } else {
      res.send({
        errors: {
          message: "No API token provided",
          status: 401,
        },
      });
    }
  },
};
