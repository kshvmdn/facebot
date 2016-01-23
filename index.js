'use strict';

const config = require('./config');

const login = require('facebook-chat-api');
const client = require('twilio')(config.twilio.accountSid, config.twilio.authToken);

const FacebotModel = require('./Schema');

login({email: config.fb.email, password: config.fb.pass}, function callback(err, api) {
  if (err) return console.error(err);

  var listen = api.listen(function callback(err, message) {
    if (err) return console.error(err);

    var body = message.body.toLowerCase(); 
    var sender = message.senderID;

    if (body.includes('@facebot ')) {
      body = body.slice('@facebot '.length);
      if (body.includes('register ')) {
        console.log('register called');
        body = body.slice('register '.length).split('`');
        var name = body[0].trim();
        var number = body[1];
        new FacebotModel({name: name, number: number}).save();
      } else if (body.includes('send ')) {
        console.log('send called');
        body = body.slice('send '.length).split('`');
        var name = body[0].trim();
        var msg = body[1];
        FacebotModel.findOne({ name: name }, function(err, foo) {console.log(foo.number)});
      }
    }
  });

  // client.messages.create({
  //     body: "Test",
  //     to: "2892339850",
  //     from: config.twilio.number
  // }, function(err, message) {
  //     process.stdout.write(message.sid);
  // });
});