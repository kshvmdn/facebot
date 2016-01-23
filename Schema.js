const mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/facebot');

var facebotSchema = new mongoose.Schema({
    name: String,
    number: String
});

module.exports = db.model('facebot', facebotSchema);