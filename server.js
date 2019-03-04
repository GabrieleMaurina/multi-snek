const MAX_CONNECTIONS = 8

const EXPRESS = require('express')
const APP = EXPRESS()
const SERVER = require('http').createServer(APP)
const IO = require('socket.io')(SERVER)
const SNEKS = require(__dirname + '/modules/sneks.js')

console.log('server started')

APP.use(EXPRESS.static('resources'))

APP.get('/', (req, res) => {
    res.sendFile(__dirname + '/resources/client.html')
})

IO.on('connection', socket => {
  if(IO.engine.clientsCount > MAX_CONNECTIONS){
    console.log('connection refused')
    socket.disconnect();
  }
  else{
    console.log('client connected')
    socket.join('game')

    SNEKS.spawnSnek(socket)

    socket.on('dir', dir => {
      SNEKS.setSnekDir(socket, dir)
    })

    socket.on('disconnect', () => {
      console.log('client disconnected')
      SNEKS.disconnectSnek(socket)
    })
  }
})

SNEKS.update((data) => {
  IO.in('game').emit('update', data)
})

SERVER.listen(process.env.PORT || 80)
