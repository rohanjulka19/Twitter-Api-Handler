module.exports.handleOptions = (req,res) => {
    console.log(req.headers.origin )
    res.writeHead(200,{
        'Allow' : 'OPTIONS,POST,GET,HEAD,DELETE',
        'Access-Control-Allow-Origin' : req.headers.origin,
        'Access-Control-Allow-Methods' : '*',
        'Access-Control-Allow-Headers' : '*'
    })
    res.end()
}


module.exports.getDateTime = (date_time) => {
    let date_time_arr = date_time.split(" ")
    let day = date_time_arr[0]
    let time = date_time_arr[3]
    let date = date_time_arr[2] + " " + date_time_arr[1] + " " + date_time_arr[5]
    return ([day, date, time])
}

// Find a better place for them 

let users = []

module.exports.port = 8000 ; 
module.exports.host = "localhost"
module.exports.users = users
