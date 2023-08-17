import Jwt, { decode } from "jsonwebtoken";
import Config from "config";
import responseMessage from "../resources/response.json";

import Boom from "boom";
import universalFunctions from "../utils/universalFunctions";

import userModel from "../models/user.model";
import Joi, { func } from "joi";


const checkAuth =  async(req, res, next) => {
  const token = req.headers["x-access-token"] || req.query["x-access-token"] || req.headers["token"];
  console.log("token:",token);
    if (token) {
      // let decoded = jwt_decode(token);
      Jwt.verify(token, Config.get("jwt.secret"), async function (err, decoded) {
        try {
          console.log("decoded inside",decoded);

            
            let user = await userModel.findOne({ _id: decoded.userId });

            if (!user) {
              throw Boom.unauthorized(responseMessage.USER_NOT_FOUND);
            }
            user = user.toJSON();
            if (user.isDeleted) {
              throw Boom.badRequest(responseMessage.USER_NOT_FOUND);
            }
            if (user.userSuspend) {
              throw Boom.badRequest(responseMessage.userSuspend);
            }
            
       
              let userInfo = {
                id: user._id,
                name: user.name,
                email: user.email ? user.email : "",
                isPhoneVerified:user.isPhoneVerified,
                // phoneNumber: user.phoneNumber ? user.phoneNumber : "",
              };
              req.user = userInfo;
              next();

        } catch (error) {
          return universalFunctions.sendError(error, res);
        }

       })
      
    } else {
      return universalFunctions.sendError(
        Boom.forbidden(responseMessage.TOKEN_NOT_PROVIDED),
        res
      );
    }
};

  module.exports = {
    checkAuth,
    sessionManager,
  };