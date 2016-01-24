# Face*bot* Messenger
FB Messenger Bot. Built at UofTHacks III (2016).

## Commands

#### SMSBot ([Twilio](https://www.twilio.com))

> Use FB Messenger through SMS, __without data__.

Register friend

``` @smsbot register FRIEND_NAME `PHONE_NUMBER` ```

Send text message (friend __must__ be registered prior to sending)

``` @smsbot send FRIEND_NAME `MESSAGE` ```

Note: Backticks __required__, sms responses load _as new FB messages are sent_.

#### Tweetbot ([Twitter API](https://dev.twitter.com/rest/public), [npm wrapper](https://www.npmjs.com/package/twitter))

Post new Tweet - `@tweetbot tweet TEXT`

Get latest Tweet from user - `@tweetbot latest tweet USER_HANDLE`

Get up to 30 Tweets from your TL - `@tweetbot tl`


#### RandBot (uses [reddit](https://reddit.com) data, [define-it](https://www.npmjs.com/package/define-it) npm library)

Joke: `@randbot tell me a joke`

Definition: `@randbot define WORD`
