'use strict';

const config = require('./config');

const login = require('facebook-chat-api');
const twilio = require('twilio')(config.twilio.accountSid, config.twilio.authToken);

const Person = require('./models/person');
const Messages = require('./models/messages');

login({email: config.fb.email, password: config.fb.pass}, function callback(err, api) {
  if (err) return HandleError(err);

  api.setOptions({listenEvents: true});
  var listen = api.listen(function callback(err, event) {
    if (err) return HandleError(err);

    var body = event.body.toLowerCase(); 

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
          twilio.sms.messages.create({
            body: body[1],
            to: person.number,
            from: config.twilio.number
          }, function(err, sms) {
            if (err) return HandleError(err);
            console.log(sms.sid);
          });
        });
      } else if (body.includes('ping')) {
        api.sendMessage('pong', event.threadID);
      }
    }
    twilio.messages.list({}, function(err, data) { 
      data.messages.forEach(function(sms) {
        if ( sms.to == config.twilio.number ) {
          Messages.count( { sid: sms.sid }, function(err, count) {
            if ( count == 0 ) {
              Person.findOne({number: sms.from}, function(err, person) {
                if (err) return HandleError(err);
                api.sendMessage(person.name + ' says ' + sms.body + ' (' + sms.date_sent.slice(0, sms.date_sent.length-5).trim() + ')', event.threadID);
              });
              Messages.create({sid: sms.sid, threadID: event.threadID}, function(err, message) {
                if (err) return HandleError(err);
                else console.log('Message added')
              });
            }
          });
        }
      });
    });
  });
});
