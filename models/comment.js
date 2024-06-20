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

CommentSchema.virtual('date_format').get(function () {
  return this.date.toLocaleString('pl-PL');
});

CommentSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Comment', CommentSchema);
