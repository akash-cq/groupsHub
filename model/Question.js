const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [
    {
      optionText: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
  competitionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Competition",
    required: true,
  }, 
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
