"use strict";

let mongoose = require("mongoose");
// var url = "mongodb+srv://ayushmeena:ayushmeena@cluster0.vbwo8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// var url ="mongodb+srv://confluencephotog:5LzNLWoBqoxCSSXg@cluster0.fymzpll.mongodb.net/";

 

const url =
  "mongodb+srv://confluencephotog:5LzNLWoBqoxCSSXg@cluster0.fymzpll.mongodb.net/"; // Change to your MongoDB URL

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => console.error("MongoDB Connection Error:", error));
db.once("open", () => console.log("Connected to MongoDB"));

let timestamps = require("mongoose-timestamp");

mongoose.plugin(timestamps, {
  createdAt: "created_at",
  updatedAt: "modified_at",
});

module.exports = mongoose;
