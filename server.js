const DELAY = 40
const MAX = 5
const SIZE = 100
const COLORS = ['#7F7F7F','#880015','#ED1C24','#FF8927','#FFF200','#22B14C','#00A2E8','#3F48CC','#A349AE','#FFFFFF']

const UP = 0
const DOWN = 1
const RIGHT = 2
const LEFT = 3
const OPPOSITE = [1, 0, 3, 2]
const D_X = [0, 0, 1, -1]
const D_Y = [-1, 1, 0, 0]

const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

console.log('server started')

app.use(express.static('resources'))

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/resources/client.html')
})

sneks = {}

io.on('connection', socket => {
  if(Object.keys(sneks) >= MAX){
    console.log('connection refused')
    socket.disconnect();
  }
  else{
    console.log('client connected')
    socket.join('game')

    let c = Math.floor(Math.random() * COLORS.length)
    let x = Math.floor(Math.random() * SIZE / 2) + SIZE / 4
    let y = Math.floor(Math.random() * SIZE / 2) + SIZE / 4
    let dir = Math.floor(Math.random() * 4)
    sneks[socket.id] = {color:COLORS[c], dir:dir, body:[{x:x, y:y}, {x:x + D_X[OPPOSITE[dir]] * 3, y:y + D_Y[OPPOSITE[dir]] * 3}]}
    COLORS.splice(c, 1)

    socket.on('dir', dir => {
      if(dir != OPPOSITE[sneks[socket.id].dir]){
        sneks[socket.id].dir = dir
      }
    })

    socket.on('disconnect', () => {
      console.log('client disconnected')
      if(sneks[socket.id]){
        COLORS.push(sneks[socket.id].color)
        delete sneks[socket.id]
      }
    })
  }
})

function getDir(body, joint){
  if(body[joint].x > body[joint + 1].x) return RIGHT
  else if(body[joint].x < body[joint + 1].x) return LEFT
  else if(body[joint].y > body[joint + 1].y) return DOWN
  else return UP
}

function between(i, a, b){
  return i >= Math.min(a, b) && i <= Math.max(a, b)
}

function collision(x, y){
  if(x < 0 || y < 0 || x >= SIZE || y >= SIZE){
    return true
  }
  for(let id in sneks){
    let body = sneks[id].body
    for(let i = 0; i < body.length - 1; i++){
      if(x == body[i].x && between(y, body[i].y, body[i + 1].y)){
        return true
      }
      else if(y == body[i].y && between(x, body[i].x, body[i + 1].x)){
        return true
      }
    }
  }
  return false
}

function update(){
  for(let id in sneks){
    let snek = sneks[id]

    if(!collision(snek.body[0].x + D_X[snek.dir], snek.body[0].y + D_Y[snek.dir])){
      if(getDir(snek.body, 0) != snek.dir){
        snek.body.splice(0, 0, {x:snek.body[0].x, y:snek.body[0].y})
      }
      snek.body[0].x += D_X[snek.dir]
      snek.body[0].y += D_Y[snek.dir]
    }

    let tail = snek.body.length - 1
    let tailDir = getDir(snek.body, tail - 1)
    if(snek.body[tail].x + D_X[tailDir] != snek.body[0].x || snek.body[tail].y + D_Y[tailDir] != snek.body[0].y){
      snek.body[tail].x += D_X[tailDir]
      snek.body[tail].y += D_Y[tailDir]
      if(snek.body.length > 2 && snek.body[tail].x == snek.body[tail - 1].x && snek.body[tail].y == snek.body[tail - 1].y){
        snek.body.pop()
      }
    }
  }
  io.in('game').emit('update', Object.values(sneks))
  setTimeout(update, DELAY)
}
update()

server.listen(process.env.PORT || 80)
