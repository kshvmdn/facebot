const mongoose = require('mongoose');
const db = mongoose.createConnection('mongodb://localhost/facebot');

const MessageSchema = new mongoose.Schema({
  sid: String,
});

module.exports = db.model('messages', MessageSchema);