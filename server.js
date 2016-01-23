'use strict';

const express = require('express');
const app = express();

const PORT = 8080 | process.env.PORT;

// const ngrok = require('ngrok');
// const authToken = require('./config').ngrok.authToken;

// ngrok.authtoken(authToken, function(err, token) {});

// ngrok.connect({proto: 'tcp', addr: 22}, function (err, url) {
//   console.log(url);
// });

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/response.xml');
});

app.listen(PORT, function() {
  console.log('Listening on port ' + PORT + '...');
});
