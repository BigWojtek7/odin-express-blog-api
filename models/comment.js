const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: { type: String, required: true },
  date: { type: Date },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  post: { type: Schema.Types.ObjectId, ref: 'Post'}
});

CommentSchema.virtual('url').get(function () {
  return `${this._id}`;
});

module.exports = mongoose.model('Comment', CommentSchema);