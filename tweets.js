const crypto = require('crypto')
const OAuth = require('oauth-1.0a')
const axios = require('axios')
const {host,port,users,handleOptions , getDateTime} = require('./utils')

let last_tweet_id = 0n ;

const request = {
    url: `https://api.twitter.com/1.1/statuses/home_timeline.json?tweet_mode=extended`,
    method: 'get',
}


module.exports.getTweets = (req,res) => {
    console.log("getting tweets")
    users.map((user)=>{
        accessToken = user.accessToken
        console.log(user)
        secret = user.secret 
        axios.get(request.url, {
            headers : oauth.toHeader(oauth.authorize(request,user)),
        }).then((result)=> {
            res.writeHead(200,{
                'Content-Type' : 'application/json' ,
                'Allow' : 'OPTIONS,POST,GET,HEAD,DELETE',
                'Access-Control-Allow-Origin' : req.headers.origin,
                'Access-Control-Allow-Methods' : '*',
                'Access-Control-Allow-Headers' : '*'
            })
            //console.log(result)
            let reducedTwitterData = [];
            result.data.map((tweetData) => {
                let tweet_id = BigInt(tweetData.id);
                last_tweet_id = ( tweet_id > last_tweet_id ? tweet_id : last_tweet_id) ; 
                reducedTwitterData = [...reducedTwitterData,{
                    text : tweetData.full_text , 
                    id : tweetData.id ,
                    created_at : getDateTime(tweetData.created_at) ,
                    user : {
                        name : tweetData.user.name,
                        screen_name: tweetData.user.screen_name,
                        url: tweetData.user.url,
                        profile_image_url: tweetData.user.profile_image_url ,
                        verified: tweetData.user.verified
                    }
                }]
            })
            //The below line only needs to be addded after the first call to twitter api 
            request.url.concat(`&since_id=${ last_tweet_id.toString()}`)  
            console.log(last_tweet_id)
            console.log(reducedTwitterData)
            res.write(JSON.stringify(reducedTwitterData))
            res.end() 
        }).catch((error) => {
            console.log(error);
            handleOptions(req,res)
            //res.end(error.toString())
        })
    })
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