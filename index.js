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
    "OPTIONS": () => handleOptions
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
    console.log(req.method)
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
        handleOptions(req,res)
    })
}

function deleteUser(req,res) {
    key = new URL(req.url, `http://${host}:${port}`).searchParams.get('key')
    users = users.filter( user => user.key !== key )
    console.log(users)
    handleOptions(req,res)
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
                'Content-Type' : 'application/json' ,
                'Allow' : 'OPTIONS,POST,GET,HEAD,DELETE',
                'Access-Control-Allow-Origin' : req.headers.origin,
                'Access-Control-Allow-Methods' : '*',
                'Access-Control-Allow-Headers' : '*'
            })
            console.log(result)
            res.write(JSON.stringify(result.data))
            res.end() 
        }).catch((error) => {
            handleOptions(req,res)
        })
    })
}

function handleOptions(req,res) {
    console.log(req.headers.origin)
    res.writeHead(200,{
        'Allow' : 'OPTIONS,POST,GET,HEAD,DELETE',
        'Access-Control-Allow-Origin' : req.headers.origin,
        'Access-Control-Allow-Methods' : '*',
        'Access-Control-Allow-Headers' : '*'
    })
    res.end()
}