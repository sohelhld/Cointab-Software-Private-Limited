const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  website: String,
  city: String,
  company: String,
});
const userModel = mongoose.model('User', userSchema);

module.exports = {userModel}