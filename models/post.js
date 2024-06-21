const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

PostSchema.virtual('url').get(function () {
  return `${this._id}`;
});

PostSchema.virtual('date_format').get(function () {
  return this.date.toLocaleDateString('pl-PL');
});

PostSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Post', PostSchema);
