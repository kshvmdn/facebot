'use strict';

const config = require('./config');

const login = require('facebook-chat-api');
const client = require('twilio')(config.twilio.accountSid, config.twilio.authToken);

const Person = require('./models/person');
const Messages = require('./models/messages');

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

        Person.create({name: body[0].trim(), number: body[1]}, function(err, person) {
          if (err) return HandleError(err);
          else console.log('New user added')
        });

      } else if (body.includes('send ')) {
        body = body.slice('send '.length).split('`');
        Person.findOne({name: body[0].trim()}, function(err, person) {
          if (err) return HandleError(err);
          client.sms.messages.create({
            body: body[1],
            to: person.number,
            from: config.twilio.number
          }, function(err, sms) {
            if (!err) console.log(sms.sid);
            else console.dir(err);
          });
        });
      }
    }
    client.messages.list({}, function(err, data) { 
      data.messages.forEach(function(message) { 
        if (message.to == config.twilio.number) {
          FacebotModel.findOne({ number: message.from }, function(err, entry) {
            api.sendMessage(entry.name + ' says ' + message.body, threadID);
          });
        }
      }); 
    });
  });
});