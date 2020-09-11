const crypto = require('crypto')
const OAuth = require('oauth-1.0a')
const axios = require('axios')
const http = require('http')
const { StringDecoder } = require('string_decoder')
const { access } = require('fs')
const decoder = new StringDecoder('utf-8')


let users = []

axios.defaults.headers.common['Acess-Control-Allow-Oigin'] = "*"

const httpMethodToFunc = {
    "POST" : (pathname) => postMethodUrls[pathname],
    "GET" : (pathname) => getMethodUrls[pathname] ,
    "DELETE": (pathname) => deleteMethodUrls[pathname],
    "PUT":() => console.log("Update not Implemented")  ,
}

const postMethodUrls = {
    "/user" : addUser
}

const getMethodUrls = {
    "/tweets": getTweets
}

const deleteMethodUrls = {
    "/user" : deleteUser
}

const port = 8000 ;
const host = "localhost"

http.createServer({}, (req, res) => {

    pathname = new URL(req.url, `http://${req.headers.host}`).pathname
    urlToFunc = httpMethodToFunc[req.method](pathname)
    
    if(urlToFunc !== undefined) {
        urlToFunc(req,res)
    } else {
        res.end("404 NOT FOUND")
    }

}).listen(8000)
//Check for duplicate user details
function addUser(req,res) {
    let buffer = ""
    req.on('data', (data) => {
        buffer += decoder.write(data)       
    })   
    req.on('end', () => {
        const user_data = JSON.parse(buffer)
        users.push(user_data)
        console.log(users)
        res.end("Added User")
    })
}

function deleteUser(req,res) {
    key = new URL(req.url, `http://${host}:${port}`).searchParams.get('key')
    users = users.filter( user => user.key !== key )
    console.log(users)
    res.end("Deleted Key")
}

const token = {
    key: "2447266872-MoM32UnFElY9vRAn5ySbB2nIlV6jCwlPsR8vPIT", 
    secret : "TvBhQ8Olz3QgVkoSIWkOm3pf6jXnOzkUhxJ5QDJczquUQ"
}

const oauth = OAuth({
    consumer: { key: "L9ecKX1gF1zti6iLYUltnMjPJ", secret: "ux6E5MV0x7FSZzjQRTFVgT6KG3bez3lKOOHOgpTUGfXLBd7mAG" },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto
            .createHmac('sha1', key)
            .update(base_string)
            .digest('base64')
    },
})
last_tweet_id = null 

const request = {
    url: 'https://api.twitter.com/1.1/statuses/home_timeline.json',
    method: 'get',
}
function getTweets(req,res) {
    console.log("getting tweets")
    console.log(users)
    users.map((user)=>{
        accessToken = user.accessToken
        console.log(user)
        secret = user.secret
        axios.get(request.url, {
            headers : oauth.toHeader(oauth.authorize(request,user))
        }).then((result)=> {
            res.writeHead(200,{
                'Content-Type' : 'application/json' 
            })
            console.log(result)
            result.data.map((tweet) => {
                res.write(JSON.stringify(tweet))
            })
            res.end()
        }).catch((error) => {
            res.end(error.toString())
        })
    })
}