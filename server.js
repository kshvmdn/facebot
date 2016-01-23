'use strict';

const express = require('express');
const app = express();

const PORT = 8080 | process.env.PORT;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/response.xml');
});

app.listen(PORT, function() {
  console.log('Listening on port ' + PORT);
});