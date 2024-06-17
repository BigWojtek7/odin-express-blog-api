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

module.exports = mongoose.model('Post', PostSchema);
