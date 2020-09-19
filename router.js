const {addUser,deleteUser} = require('./user')
const {getTweets} = require('./tweets')
const { handleOptions } = require('./utils')

const postMethodUrls = {
    "/user" : addUser
}

const getMethodUrls = {
    "/tweets": getTweets
}

const deleteMethodUrls = {
    "/user" : deleteUser
}

module.exports.httpMethodToFunc  = {
    "POST" : (pathname) => postMethodUrls[pathname],
    "GET" : (pathname) => getMethodUrls[pathname] ,
    "DELETE": (pathname) => deleteMethodUrls[pathname],
    "PUT":() => console.log("Update not Implemented")  ,
    "OPTIONS": () => handleOptions
}
