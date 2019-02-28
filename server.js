const exp = require('express')
const app = exp()
const ser = require('http').createServer(app)
const io = require('socket.io')(ser)

app.use(exp.static('resources'))

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/resources/client.html')
})

console.log('Server started.')
ser.listen(process.env.PORT || 80)
