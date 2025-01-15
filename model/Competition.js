const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
});

const Competition = mongoose.model('Competition', competitionSchema);
module.exports = Competition;
