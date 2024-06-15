const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  member_status: { type: Boolean },
  is_admin: { type: Boolean },
});

UserSchema.virtual('url').get(function () {
  return `${this._id}`;
});

module.exports = mongoose.Model('User', UserSchema);
