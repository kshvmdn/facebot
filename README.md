# Face*bot*
Facebook Messenger Bot. Brings SMS messaging and Twitter interaction capabilities to FB Messenger. 

Built at UofTHacks III (2016).

### Commands

##### SMSBot ([Twilio](https://www.twilio.com))

Use FB Messenger through SMS, __without data__.

+ Register friend

  ``` 
  @smsbot register FRIEND_NAME `PHONE_NUMBER`
  ```

+ Send text message (friend __must__ be registered prior to sending)

  ```
  @smsbot send FRIEND_NAME `MESSAGE` 
  ```

Note: Backticks __required__, sms responses load _as new FB messages are sent_.

##### Tweetbot ([Twitter API](https://dev.twitter.com/rest/public)/[npm wrapper](https://www.npmjs.com/package/twitter))

+ Post new Tweet 

  ```
  @tweetbot tweet MESSAGE
  ```

+ Get latest Tweet from user

  ```
  @tweetbot latest tweet USER_HANDLE
  ```

+ Get new Tweets from your timeline

  ```
  @tweetbot tl
  ```

##### RandBot (uses [reddit](https://reddit.com) data, [define-it](https://www.npmjs.com/package/define-it) npm library)

+ Random joke (from [/r/jokes](https://reddit.com/r/jokes))

  ```
  @randbot tell me a joke
  ```

+ Definition

  ```
  @randbot define WORD
  ```

+ NBA Scores

  ```
  @randbot nba
  ``` 

### Setup

+ Clone project, install requirements
 
  ```
  git clone http://github.com/kshvmdn/facebot && cd facebot
  ```
  
  ```
  npm install
  ```
  
+ Configure credentials
 
  ```
  touch config.js
  ```
  
  ```javascript
  module.exports.fb = { // https://facebook.com (login information)
    email: '',
    pass: ''
  }
  
  module.exports.twilio = { // https://www.twilio.com/try-twilio
    accountSid: '',
    number: '',
    authToken: ''
  }
  
  module.exports.twitter = { // https://apps.twitter.com
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
  }
  
  module.exports.ngrok = { // https://ngrok.com
      authToken: ''
  }
  ```
  
+ Install [ngrok](https://www.npmjs.com/package/ngrok) globally
+ Run the app

  ```
  mongod
  ```
  
  ```
  node server.js
  ```
  
  Replace the request URL on [Twilio](https://www.twilio.com/user/account/messaging/phone-numbers) with the `ngrok` tunnel URL (find it by running the following command)
  
  ```
  ngrok http 8080 -host-header="localhost:8080"
  ```
  
  ```
  node index.js
  ```
