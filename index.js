'use strict';

const config = require('./config');
const define = require('define-it').definitions;
const exec = require('child_process').exec;
const login = require('facebook-chat-api');
const request = require('request');
const twilioClient = require('twilio')(config.twilio.accountSid, config.twilio.authToken);
const Twitter = require('twitter');
const twitterClient = new Twitter(config.twitter);
const wolfram = require('wolfram-alpha').createClient(config.wolfram.key);

const Person = require('./models/person');
const Messages = require('./models/messages');
const Threads = require('./models/threads');

login({email: config.fb.email, password: config.fb.pass}, function callback(err, api) {
  if (err) return Error(err);
  const events = []; var numMsgs = 0;
  var listen = api.listen(function callback(err, event) {
    if (err) return Error(err);
    events.push(event); numMsgs++;
    var body = event.body.toLowerCase(); 

    // twilio sms integration
    if (body.includes('@smsbot ')) {
      body = body.slice('@smsbot '.length);
      if (body.includes('register ')) {
        body = body.slice('register '.length).split('`');
        Person.create({name: body[0].trim(), number: body[1]}, function(err, person) {
          if (err) return Error(err);

          api.sendMessage('User \'' + body[0].trim() + '\' added!', event.threadID);
          console.log('New user added')
        });
      } else if (body.includes('send ')) {
        body = body.slice('send '.length).split('`');
        Person.findOne({name: body[0].trim()}, function(err, person) {
          if (err || person == null) return Error(err);
          twilioClient.sms.messages.create({
            body: body[1],
            to: person.number,
            from: config.twilio.number
          }, function(err, sms) {
            if (err) return Error(err);
            api.sendMessage('Message sent successfully!', event.threadID);
            Threads.count({ threadID: event.threadID }, function(err, count) {
              if ( count == 0 ) {
                Threads.create({ threadID: event.threadID, messages: [sms.sid] }, function(err, thread) {
                  if (err) return Error(err);
                  console.log('New thread added');
                });
              } else {
                Threads.findOneAndUpdate(
                  { threadID: event.threadID }, 
                  { $push: { messages: sms.sid } },
                  { safe: true, upsert: true },
                  function(err, model) {
                    if (err) return Error(err);
                    console.log('Added msg to thread');
                  }
                )
              }
            });
          });
        });
      }
    }

    // twitter integration
    else if (body.includes('@tweetbot ')) {
      body = body.slice('@tweetbot '.length);
      if (body == 'tweet that') {
        if (numMsgs >= 2) {
          console.log('Posting tweet...');
          twitterClient.post('statuses/update', {status: events[numMsgs-2].body.toLowerCase()},  function(error, tweet, response){
            if (error) return Error(error); 
            api.sendMessage('Tweet successful!', event.threadID);
          });
        } else {
          api.sendMessage('No previous msg!', event.threadID);
        }
      } else if (body.includes('tweet ')) {
        body = body.slice('tweet '.length); // tweet
        console.log('Posting tweet...')
        twitterClient.post('statuses/update', {status: body},  function(error, tweet, response){
          if (error) return Error(error); 
          api.sendMessage('Tweet successful!', event.threadID);
        });
      } else if (body.includes('latest status ')) {
        console.log('Getting user\'s latest tweet...')
        body = body.slice('latest status '.length); // username
        twitterClient.get('statuses/user_timeline', {screen_name: body}, function(error, tweets, response){
          var i = 0;
          var tweet = tweets[i]; 
          while (tweet.retweeted || tweet['retweeted_status'] != undefined || tweet.text.indexOf('http') != -1) {
            i += 1;
            tweet = tweets[i];
          }
          api.sendMessage(tweet.text, event.threadID);
        });
      } else if (body.includes('tl')) {
        console.log('Getting TL tweets...');
        twitterClient.get('statuses/home_timeline', {count: 30}, function(error, tweets, response){
          tweets.forEach(function(tweet) {
            var count = (tweet.text.match(/http/g) || []).length;
            var text = tweet.text;
            for (let i = 0; i < count; i++) {
              // super hacky way of removing links from text, i apologize l o l
              text = text.replace(text.slice(text.indexOf('https'), text.indexOf('https') + 24), '').trim()
            }
            api.sendMessage(text, event.threadID);
          });
        });
      }
    }

    // rand integrations cuz why not
    else if (body.includes('@bot ')) {
      body = body.slice('@bot '.length);
      if (body.includes('tell me a joke')) {
        console.log('Loading joke...');
        let url = ['https://www.reddit.com/r/jokes.json?count=100', 'https://www.reddit.com/r/cleanjokes.json?count=100'];
        request(url[Math.floor(Math.random() * url.length)], function(error, response, body) {
          var jokes = JSON.parse(body).data.children;
          var joke = jokes[Math.floor(Math.random() * jokes.length)].data;
          var q = joke.title;
          var p = joke.selftext;
          api.sendMessage(q, event.threadID);
          setTimeout(function() {
            api.sendMessage(p + ' 😄', event.threadID);
          }, 3000);
        });
      } else if (body.includes('define ')) {
        console.log('Loading definition...')
        body = body.replace('define ', '');
        define(body, function(err, res) {
          var response = (err) ? '\''+ body +'\' not defined 😞' : res[0]
          api.sendMessage(response, event.threadID)
        })
      } else if (body.includes('nba') && process.env.LOGNAME == 'kashavmadan') {
        console.log('Loading last night\'s scores...');
        exec('python3 main.py --a --d \'y\' ', {cwd: '../../Code/projects/nba-scores'}, function(err, stdout, stderr) {
          api.sendMessage(stdout, event.threadID);
        });
      } else if (body.includes('tell me ')) {
        console.log('Getting wolfram response...')
        body = body.slice('tell me '.length);
        console.log(body);
        wolfram.query(body, function (err, results) {
          if (err) return Error(err);
          if (results == null || results.length == 0) return api.sendMessage('No result 😞', event.threadID);
          results.forEach(function(result) {
            if (result.primary) api.sendMessage(result.subpods[0].text, event.threadID);
          });
        });
      }
    }

    else if (body.includes('ping')) {
      api.sendMessage('pong', event.threadID);
    }

    // populate db collection with any new messages
    twilioClient.messages.list({}, function(err, data) { 
      data.messages.forEach(function(sms) {
        if ( sms.to == config.twilio.number ) {
          Messages.count( { sid: sms.sid }, function(err, count) {
            if ( count == 0 ) {
              Messages.create({sid: sms.sid, threadID: event.threadID, shown: false}, function(err, message) {
                if (err) return Error(err);
                console.log('Message added')
              });
            }
          });
        }
      });
    });

    // send unshown msgs to current fb thread
    Messages.find({ threadID: event.threadID, shown: false }, function(err, messages) {
      if (messages.length > 0) {
        messages.forEach(function(sms) {
          twilioClient.messages(sms.sid).get(function(err, sms1) {
            Person.findOne({ number: sms1.from }, function(err, person) {
              if (err) return Error(err);
              var name = person == null ? sms.from : person.name;
              api.sendMessage(name + ' says ' + sms1.body + ' [' + sms1.date_sent.slice(0, sms1.date_sent.length-5).trim() + ']', event.threadID);
              Messages.findOneAndUpdate(
                  { _id:  sms._id }, 
                  { $set: { shown: true } },
                  { safe: true, upsert: true },
                  function(err, model) {
                    if (err) return Error(err);
                  }
                )
            });
          });
        })
      }
    });
  });
});
