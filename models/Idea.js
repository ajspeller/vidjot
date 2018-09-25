const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// create schema
const IdeaSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  details: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
});

mongoose.model('idea', IdeaSchema);