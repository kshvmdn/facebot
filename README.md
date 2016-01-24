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
  @tweetbot latest status USER_HANDLE
  ```

+ Get new Tweets from your timeline

  ```
  @tweetbot tl
  ```

##### Misc. commands

+ Get a random joke (from [/r/jokes](https://reddit.com/r/jokes))

  ```
  @bot tell me a joke
  ```

+ Define a word

  ```
  @bot define {WORD}
  ```

+ Get today's NBA Scores

  ```
  @bot nba
  ``` 

+ Do mathematical/scientific computations

  ```
  @bot tell me {QUERY}
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
