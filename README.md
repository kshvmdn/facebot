# Face*bot* Messenger
FB Messenger Bot. Built at UofTHacks III (2016).

## Commands

#### FB, SMS Messaging (made with [Twilio](https://www.twilio.com))

> Backticks __required__, sms responses load _as new FB messages are sent_.

Register friend

``` @smsbot register FRIEND_NAME `PHONE_NUMBER` ```

Send text message (friend __must__ be registered prior to sending)

``` @smsbot send FRIEND_NAME `MESSAGE` ```

#### Twitter (made with [Twitter](https://dev.twitter.com/rest/public) [npm library](https://www.npmjs.com/package/twitter))

Post new Tweet - `@tweetbot tweet TEXT`

Get latest Tweet from user - `@tweetbot latest tweet USER_HANDLE`

Get up to 30 Tweets from your TL - `@tweetbot tl`


#### Random

Joke: `@bot tell me a joke`

Definition: `@bot define WORD`
