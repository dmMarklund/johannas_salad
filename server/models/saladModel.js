const mongoose = require("mongoose");

const saladSchema = new mongoose.Schema({
  year: Number,
  weekNumber: Number,
  saladName: String,
  rensade: Number,
  orsak: String,
});

const Salad = mongoose.model("Salad", saladSchema, "salads");

module.exports = Salad;
