"use strict";

let mongoose = require("./db.server.connect"),
  Schema = mongoose.Schema,
  _ = require("underscore");

var event = new Schema({

  eventName:{type: String,trim: true},
  cooridnatorName:{type: String,trim: true},
  cooridnatorNumber:{type: String,trim: true},
  cooridnatorName2:{type: String,trim: true},
  cooridnatorNumber2:{type: String,trim: true},
  venue:{type: String,trim: true},
  rule:{type: String,trim: true},
  description:{type: String,trim: true},
  clubName:{type: String,trim: true},
  image:{type: String,trim: true},
  date:{type: String,trim: true},
  time:{type: String,trim: true},

});

event.index({ zipcode: "text" }) ;
event.index({ state: "text" });
event.index({ city: "text" });

module.exports = mongoose.model("event", event);