const mongoose = require('mongoose');
const db = mongoose.createConnection('mongodb://localhost/facebot');

const ThreadSchema = new mongoose.Schema({
  threadId: Number,
  messages: [String]
},  { strict: false });

module.exports = db.model('threads', ThreadSchema);