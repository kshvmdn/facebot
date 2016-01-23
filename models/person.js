const mongoose = require('mongoose');
const db = mongoose.createConnection('mongodb://localhost/facebot');

const PersonSchema = new mongoose.Schema({
  name: String,
  number: String
},  { strict: false });

module.exports = db.model('person', PersonSchema);