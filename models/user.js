const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  is_admin: { type: Boolean },
});

UserSchema.virtual('url').get(function () {
  return `${this._id}`;
});

module.exports = mongoose.model('User', UserSchema);
