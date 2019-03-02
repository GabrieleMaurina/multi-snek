//const SERVER = 'localhost'
const SERVER = 'multi-snek.herokuapp.com'

const UP = 0
const DOWN = 1
const RIGHT = 2
const LEFT = 3

var socket = io(SERVER)

socket.on('connect', function(){
  console.log('connected')
})

socket.on('update', function(sneks){
  background()
  for(let index in sneks){
    let snek = sneks[index]
    CONTEXT.fillStyle = snek.color
    for(let position = 0; position < snek.body.length - 1; position++){
      let x_min = Math.min(snek.body[position].x, snek.body[position + 1].x)
      let y_min = Math.min(snek.body[position].y, snek.body[position + 1].y)
      let x_max = Math.max(snek.body[position].x, snek.body[position + 1].x)
      let y_max = Math.max(snek.body[position].y, snek.body[position + 1].y)

      let x = x_min * SCALE
      let y = y_min * SCALE
      let dx = x_max * SCALE - x + SCALE
      let dy = y_max * SCALE - y + SCALE

      CONTEXT.fillRect(x, y, dx, dy)
      console.log(x, y, dx, dy)
    }
  }
})

socket.on('disconnect', function(){
  console.log('disconnected')
})

document.onkeyup = (e) => {
  if(e.key == 'ArrowUp'){
    socket.emit('dir', UP)
  }
  else if(e.key == 'ArrowDown'){
    socket.emit('dir', DOWN)
  }
  else if(e.key == 'ArrowRight'){
    socket.emit('dir', RIGHT)
  }
  else if(e.key == 'ArrowLeft'){
    socket.emit('dir', LEFT)
  }
}

//const DESKTOP = !('ontouchstart' in window)
