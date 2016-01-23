# Face*bot* Messenger
FB Messenger Bot. Built at UofTHacks III (2016).

## Commands

#### FB, SMS Messaging (made with [Twilio](https://www.twilio.com))

Register each friend with their name/number, then message them between FB Messenger and SMS; responses are loaded *as messages are sent*.

``` @smsbot register FRIEND_NAME `PHONE_NUMBER` ```

``` @smsbot send FRIEND_NAME `MESSAGE` ``` (__must__ be registered prior to sending messages)

Backticks *required*.

#### Twitter (made with [Twitter API](https://www.npmjs.com/package/twitter))

Post a new Tweet -- `@tweetbot tweet STATUS`
Get Latest Tweet from any user -- `@tweetbot latest tweet USER_HANDLE`
Get 30 Tweets from the Home timeline -- `@tweetbot tl`
