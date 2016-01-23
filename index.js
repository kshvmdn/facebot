'use strict';

const config = require('./config');

const login = require('facebook-chat-api');
const client = require('twilio')(config.twilio.accountSid, config.twilio.authToken);

const FacebotModel = require('./Schema');

login({email: config.fb.email, password: config.fb.pass}, function callback(err, api) {
  if (err) return console.error(err);

  var listen = api.listen(function callback(err, message) {
    if (err) return console.error(err);

    var threadID = message.threadID;
    var body = message.body.toLowerCase(); 
    var sender = message.senderID;

    if (body.includes('@facebot ')) {
      body = body.slice('@facebot '.length);
      if (body.includes('register ')) {
        body = body.slice('register '.length).split('`');
        new FacebotModel({name: body[0].trim(), number: body[1]}).save();
      } else if (body.includes('send ')) {
        body = body.slice('send '.length).split('`');
        FacebotModel.findOne({ name: body[0].trim() }, function(err, entry) {
          client.sms.messages.create({
            body: body[1],
            to: entry.number,
            from: config.twilio.number
          }, function(err, message) {
            if (!err) console.log(message.sid);
            else console.log(err);
          });
        });
      }
    }
  });


});