const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    userId: { type: String },
    id: { type: String },
    title: { type: String },
    body: { type: String },
});

const postModel = mongoose.model("Post", postSchema);

module.exports = { postModel };
