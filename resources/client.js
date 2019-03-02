const UP = 0
const DOWN = 1
const RIGHT = 2
const LEFT = 3

const FOOD_COLOR = '#FFFFFF'

const SOCKET = io(window.location.href)

SOCKET.on('connect', function(){
  console.log('connected')
})

SOCKET.on('update', function(data){
  background()
  for(let index in data.sneks){
    let snek = data.sneks[index]
    context.fillStyle = snek.color
    for(let position = 0; position < snek.body.length - 1; position++){
      let x_min = Math.min(snek.body[position].x, snek.body[position + 1].x)
      let y_min = Math.min(snek.body[position].y, snek.body[position + 1].y)
      let x_max = Math.max(snek.body[position].x, snek.body[position + 1].x)
      let y_max = Math.max(snek.body[position].y, snek.body[position + 1].y)

      let x = x_min * xScale
      let y = y_min * yScale
      let dx = x_max * xScale - x + xScale
      let dy = y_max * yScale - y + yScale

      context.fillRect(x, y, dx, dy)
    }
  }
  for(let index in data.food){
    context.fillStyle = FOOD_COLOR
    context.beginPath()
    context.ellipse(data.food[index].x * xScale + xScale / 2, data.food[index].y * yScale + yScale / 2, xScale / 2, yScale / 2, 0, 0, 2 * Math.PI)
    context.fill()
  }
})

SOCKET.on('disconnect', function(){
  console.log('disconnected')
})

const ARROWS = [false, false, false, false]

document.onkeydown = (e) => {
  if(e.key == 'ArrowUp' && !ARROWS[UP]){
    ARROWS[UP] = true
    SOCKET.emit('dir', UP)
  }
  else if(e.key == 'ArrowDown' && !ARROWS[DOWN]){
    ARROWS[DOWN] = true
    SOCKET.emit('dir', DOWN)
  }
  else if(e.key == 'ArrowRight' && !ARROWS[RIGHT]){
    ARROWS[RIGHT] = true
    SOCKET.emit('dir', RIGHT)
  }
  else if(e.key == 'ArrowLeft' && !ARROWS[LEFT]){
    ARROWS[LEFT] = true
    SOCKET.emit('dir', LEFT)
  }
}

document.onkeyup = (e) => {
  if(e.key == 'ArrowUp'){
    ARROWS[UP] = false
  }
  else if(e.key == 'ArrowDown'){
    ARROWS[DOWN] = false
  }
  else if(e.key == 'ArrowRight'){
    ARROWS[RIGHT] = false
  }
  else if(e.key == 'ArrowLeft'){
    ARROWS[LEFT] = false
  }
}

//const DESKTOP = !('ontouchstart' in window)
