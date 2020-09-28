const crypto = require('crypto')
const OAuth = require('oauth-1.0a')
const axios = require('axios')
const { users, handleOptions, getDateTime } = require('./utils')

const requestMethod = 'get'
const requestUrl = 'https://api.twitter.com/1.1/statuses/home_timeline.json?tweet_mode=extended'

module.exports.getTweetsFromAllAccounts = (req, res) => {
    let getAllTweetsPromiseArray = [];
    let tweetsFromAllAccounts = [];
    users.map((user) => {
        getAllTweetsPromiseArray.push(getTweets(user))
    })
    Promise.all(getAllTweetsPromiseArray)
        .then((results) => {
            results.map((result, index) => {
                let reducedTwitterData = getReducedTweets(result)
                tweetsFromAllAccounts = [...tweetsFromAllAccounts, {
                    key: users[index].key,
                    tweets: reducedTwitterData
                }]
                users[index].last_tweet_id = getLastTweetId(reducedTwitterData)
            })
            console.log("tweets")
            console.log(tweetsFromAllAccounts)
            res.write(JSON.stringify(tweetsFromAllAccounts))
            handleOptions();
        })
}

function getTweets(user) {
    const request = getRequestObject(user)
    console.log(request);
    console.log(user)
    accessToken = user.accessToken
    console.log(user)
    secret = user.secret
    let getTweetsRequest = axios.get(request.url, {
        headers: oauth.toHeader(oauth.authorize(request, user)),
    })
    return getTweetsRequest;
}

function getRequestObject(user) {

    let requestObject = {}
    requestObject.method = requestMethod
    requestObject.url = requestUrl
    if (user.hasOwnProperty('last_tweet_id')) {
        requestObject.url = `${requestUrl}&since_id=${user.last_tweet_id.toString()}`
    }
    return requestObject
}

function getReducedTweets(result) {
    let reducedTwitterData = [];
    result.data.map((tweetData) => {
        reducedTwitterData = [...reducedTwitterData, {
            text: tweetData.full_text,
            id: tweetData.id,
            created_at: getDateTime(tweetData.created_at),
            user: {
                name: tweetData.user.name,
                screen_name: tweetData.user.screen_name,
                url: tweetData.user.url,
                profile_image_url: tweetData.user.profile_image_url,
                verified: tweetData.user.verified
            }
        }]
    })
    return reducedTwitterData
}

function getLastTweetId(reducedTwitterData) {
    //Init last_tweet_id with first tweet id in reducedTwitterData array
    let last_tweet_id = BigInt(reducedTwitterData[0].id);
    reducedTwitterData.map((tweet) => {
        last_tweet_id = (tweet.id > last_tweet_id ? tweet.id : last_tweet_id);
    })
    return last_tweet_id
}

oauth = OAuth({
    consumer: { key: "L9ecKX1gF1zti6iLYUltnMjPJ", secret: "ux6E5MV0x7FSZzjQRTFVgT6KG3bez3lKOOHOgpTUGfXLBd7mAG" },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto
            .createHmac('sha1', key)
            .update(base_string)
            .digest('base64')
    },
})



/*{
                text: "To make room for more expression we will now count all emojis as equal—including those with gender‍‍‍ and skin t… https://t.co/MkGjXf9aXm",
                id: "1050118621198921728",
                created_at: this.getDateTime("Wed Oct 10 20:19:24 +0000 2018"),
                user: {
                    name: "Twitter API",
                    screen_name: "TwitterAPI",
                    url: "https://t.co/8IkCzCDr19",
                    profile_image: "https://pbs.twimg.com/profile_images/942858479592554497/BbazLO9L_normal.jpg",
                    verified: true,
                }
            }*/