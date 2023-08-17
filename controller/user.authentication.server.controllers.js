
let 
jwt = require("jsonwebtoken"),
jwt_decode = require("jwt-decode");
let userModel = require('../models/user.model')


exports.hasAuthentcation = function (req, res, next) {
  return async (req, res, next) => {
    try {
      var token = req.headers["authorization"];
      if (token) {
        console.log("token",token)
        let decoded = jwt_decode(token);
        console.log("decoded",decoded)
        if (decoded) {
          let user = await userModel.findOne({
            _id: decoded.data,
          });

          if (!user) {
            res.status(403).json({
              success: false,
              message: "Oops!!! User not found.",
            });
          }

          // user = user.toJSON();
          user=  JSON.parse(JSON.stringify(user));
          req.user = user;
          console.log(user,'here is ')
          next();

        }
      } else {
        res.status(403).json({
          success: false,
          message: "No Token",
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };
};


