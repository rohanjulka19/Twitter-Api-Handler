module.exports.handleOptions = (req, res) => {
    console.log(req.headers.origin)
    res.writeHead(200, {
    /*  We can only call writeHead one time. 
        So in get Tweets api we have to set content type 
        To JSON so that the browser parses it in JSON format */
        'Content-Type': 'application/json', 
        'Allow': 'OPTIONS,POST,GET,HEAD,DELETE',
        'Access-Control-Allow-Origin': req.headers.origin,
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
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

let users = [{
    key: '2447266872-YfLJt8Uc222aKr1UHe6AIepBbJiAtL63C4nV0by',
    secret: 'byWNd6CQZEIIfNlN1ktb1wGuWQOwJQqlfgHFjZ9qRlexu'
},
{
    key: '1310590545362694144-xw608j935p8GyPGbyzv8cmwQ5g5kmh',
    secret: 'ryLSiYAkLLWDQZbiJs4Ma32xv1cSKkQjc8gTEgCJVpdBB'
}
]

module.exports.port = 8000;
module.exports.host = "localhost"
module.exports.users = users
