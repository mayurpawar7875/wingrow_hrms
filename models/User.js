const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['organizer', 'market manager', 'business_development'],
    required: true
  },
  phone:{
    type: String,
    required: true

  },
});


module.exports = mongoose.model('User', UserSchema, 'users');
