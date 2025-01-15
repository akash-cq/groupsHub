const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique : true
  },
  email: {
    type: String,
    unique: true,
    required:true
  },
  password: String,
  groups: [
    {
      groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
      groupname: String,
      role: { type: String, enum: ["admin", "member"], default: "member" },
      joined_at :{
        type: Date,
        default: Date.now
      }
    },
  ],
  timeStamp:{
    type:Date,
    default:Date.now
  }
});
const user = mongoose.model('User', UserSchema);
module.exports = user;
