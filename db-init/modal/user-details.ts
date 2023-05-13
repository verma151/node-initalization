var mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
});

export const User = mongoose.model('User', UserSchema);
