const mongoose = require('mongoose');
const validator = require('validator');

const schemaArticle = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validator(v) {
      return validator.isURL(v);
    },
    message: 'URL is invalid',
  },
  image: {
    type: String,
    require: true,
    validator(v) {
      return validator.isURL(v);
    },
    message: 'URL is invalid',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    select: false,
    ref: 'users',
  },
});

module.exports = mongoose.model('article', schemaArticle);
