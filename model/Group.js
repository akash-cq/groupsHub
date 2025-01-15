const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true ,unique:true},
  description: { type: String, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  competitions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Competition" }],
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId ,ref:"User"},
      content:{
        type:String,
        required:true,
      },
      timestamp:{
        type:Date,
        default:Date.now
      }
    },
  ],
  limit: {
    type: Number,
    default: Number.MAX_SAFE_INTEGER,
  },
  group_type: {
    type: String,
    enum: ["public", "private"],
    default: "public",
  },
  created_at: { type: Date, default: Date.now },
  last_Active: { type: Date, default: Date.now },
});

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
