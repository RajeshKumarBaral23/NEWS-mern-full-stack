const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  image: {
    type: String,  // URL of the image (optional)
    required: false
  },
  published: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
