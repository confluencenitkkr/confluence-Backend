"use strict";

let mongoose = require("./db.server.connect"),
  Schema = mongoose.Schema,
  _ = require("underscore");

var SponsorSchema = new Schema({
      name: {
        type: String,
        trim: true,
      },
      role: {
        type: String,
        trim: true,
      },
      image: {
        type: String,
        trim: true,
      },
      reDirectUrl: {
        type: String,
        trim: true,
      },
      
});



module.exports = mongoose.model("sponsor", SponsorSchema);