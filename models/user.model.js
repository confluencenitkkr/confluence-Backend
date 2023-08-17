"use strict";

let crypto =require("crypto");
let mongoose = require("./db.server.connect"),
  Schema = mongoose.Schema,
  _ = require("underscore");
//   config = require("../config.server");

var UserSchema = new Schema({
      name: {
        type: String,
        trim: true,
      },
      collegeName: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
      },
      googleId: {
        type: String,
        trim: true,
      },
      rollNo: {
        type: String,
        trim: true,
      },
      password: {
        type: String,
        trim: true,
      },
      salt: {
        type: String,
      },
});
UserSchema.pre("save", function (next) {
  if (this.password && this.password.length > 0) {
    this.salt = new Buffer(crypto.randomBytes(16).toString("base64"), "base64");
    this.password = this.hashPassword(this.password);
  }
  next();
});
/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
  if (this.salt && password) {
    let data=
       crypto
      .pbkdf2Sync(password, this.salt, 10000, 64, "sha512")
      .toString("base64");
      console.log(data,"password ");
      return data;
  } else {
    console.log(password);
    return password;
  }
};
/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
  console.log(password,"here is passowrd");
  return this.password === this.hashPassword(password);
};


module.exports = mongoose.model("user", UserSchema);