const http = require('http')
const { httpMethodToFunc } = require('./router')

http.createServer({}, (req, res) => {

    endpoint = new URL(req.url, `http://${req.headers.host}`).pathname
    urlToFunc = httpMethodToFunc[req.method](endpoint) 
    if(urlToFunc !== undefined) {
        urlToFunc(req,res)
    } else {
        res.end("404 NOT FOUND")
    }
}).listen(8000)
