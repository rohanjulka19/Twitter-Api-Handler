const { StringDecoder } = require('string_decoder')
const decoder = new StringDecoder('utf-8')
const { host,port,handleOptions,deleteUserByKey } = require('./utils')
let { users } = require('./utils.js')



//Check for duplicate user details
module.exports.addUser = (req,res) => {
    let buffer = ""
    req.on('data', (data) => {
        buffer += decoder.write(data)       
    })   
    req.on('end', () => {
        const user_data = JSON.parse(buffer)
        users.push(user_data)
        handleOptions(req,res)
    })
}

module.exports.deleteUser = (req,res) => {
    key = new URL(req.url, `http://${host}:${port}`).searchParams.get('key')
    users = users.filter(user => user.key !== key) 
    console.log(users)
    handleOptions(req,res)
    
}
