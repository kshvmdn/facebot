# Face*bot* Messenger
FB Messenger Bot. Built at UofTHacks III (2016).

## Commands

#### FB, SMS Messaging (made with [Twilio](https://www.twilio.com))

Register each friend with their name/number, then chat with them through FB Messenger and SMS; responses are loaded *as new FB messages are sent*.

Register friend

``` @smsbot register FRIEND_NAME `PHONE_NUMBER` ```

Send text message (__must__ be registered prior to sending message)

``` @smsbot send FRIEND_NAME `MESSAGE` ```

Backticks __required__.

#### Twitter (made with [Twitter API](https://www.npmjs.com/package/twitter))

Post new Tweet - `@tweetbot tweet TEXT`

Get latest Tweet from user - `@tweetbot latest tweet USER_HANDLE`

Get up to 30 Tweets from your TL - `@tweetbot tl`
