const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

PostSchema.virtual('url').get(function () {
  return `${this._id}`;
});

module.exports = mongoose.model('Post', PostSchema);