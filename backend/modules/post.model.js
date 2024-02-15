const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: String,
  title: String,
  body: String,
});

const postModel=mongoose.model('Post', postSchema);

module.exports = {postModel}