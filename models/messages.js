const mongoose = require('mongoose');
const db = mongoose.createConnection('mongodb://localhost/facebot');

const MessageSchema = new mongoose.Schema({
  sid: String,
  threadId: Number
},  { strict: false });

module.exports = db.model('messages', MessageSchema);