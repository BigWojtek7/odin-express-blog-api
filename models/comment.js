const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: { type: String, required: true },
  date: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
});

CommentSchema.virtual('url').get(function () {
  return `${this._id}`;
});

module.exports = mongoose.model('Comment', CommentSchema);
