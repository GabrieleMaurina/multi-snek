const DELAY = 50

const MAX_SNEKS = 8
const SIZE = 100
const MIN_SIZE = 5
const INCREMENT = 3
const FOOD = 3
const COLORS = ['#880015','#ED1C24','#FF8927','#FFF200','#22B14C','#00A2E8','#3F48CC','#A349AE']

const UP = 0
const DOWN = 1
const RIGHT = 2
const LEFT = 3
const OPPOSITE = [1, 0, 3, 2]
const D_X = [0, 0, 1, -1]
const D_Y = [-1, 1, 0, 0]

var sneks = {}
var food = []
for(let i = 0; i < FOOD; i++) food.push(getRandomEmptyPoint())

module.exports = {
  spawnSnek,
  setSnekDir,
  disconnectSnek,
  update
}

function spawnSnek(socket){
  function checkSnekSpawn(x, y, dir){
    function busy(x, y){
      return isFood(x, y) || collision(x, y)
    }
    dir = OPPOSITE[dir]
    for(let index = 0; index < MIN_SIZE; index++){
      if(busy(x + D_X[dir] * index, y + D_Y[dir] * index)) return true
    }
    return false
  }

  let c = Math.floor(Math.random() * COLORS.length)
  let x, y, dir

  do{
    x = Math.floor(Math.random() * SIZE / 2) + Math.floor(SIZE / 4)
    y = Math.floor(Math.random() * SIZE / 2) + Math.floor(SIZE / 4)
    dir = Math.floor(Math.random() * 4)
  }while(checkSnekSpawn(x, y, dir))

  sneks[socket.id] = {
    color:COLORS[c],
    dir,
    size: MIN_SIZE,
    grow: 0,
    body:[
      {x, y},
      {x:x + D_X[OPPOSITE[dir]] * 3, y:y + D_Y[OPPOSITE[dir]] * MIN_SIZE}
    ]
  }
  COLORS.splice(c, 1)
}

function setSnekDir(socket, dir){
  dir = Math.max(Math.min(parseInt(dir), 3), 0)
  if(dir != OPPOSITE[getDir(sneks[socket.id].body, 0)]){
    sneks[socket.id].dir = dir
  }
}

function disconnectSnek(socket){
  if(sneks[socket.id]){
    COLORS.push(sneks[socket.id].color)
    delete sneks[socket.id]
  }
}

function isFood(x, y, replace = false){
  for(let index in food){
    if(food[index].x == x && food[index].y == y){
      if(replace){
        food[index] = getRandomEmptyPoint()
      }
      return true
    }
  }
  return false
}

function getRandomEmptyPoint(){
  let x, y
  do{
    x = Math.floor(Math.random() * SIZE)
    y = Math.floor(Math.random() * SIZE)
  }while(collision(x, y) || isFood())
  return {x:x,y:y}
}

function getDir(body, joint){
  if(body[joint].x > body[joint + 1].x) return RIGHT
  else if(body[joint].x < body[joint + 1].x) return LEFT
  else if(body[joint].y > body[joint + 1].y) return DOWN
  else return UP
}

function between(i, a, b){
  return i >= Math.min(a, b) && i <= Math.max(a, b)
}

function collision(x, y, grow = false){
  if(x < 0 || y < 0 || x >= SIZE || y >= SIZE){
    return true
  }
  for(let id in sneks){
    let body = sneks[id].body
    for(let i = 0; i < body.length - 1; i++){
      if((x == body[i].x && between(y, body[i].y, body[i + 1].y)) || (y == body[i].y && between(x, body[i].x, body[i + 1].x))){
        if(grow){
          sneks[id].grow++
        }
        return true
      }
    }
  }
  return false
}

function moveHead(snek){
  if(!collision(snek.body[0].x + D_X[snek.dir], snek.body[0].y + D_Y[snek.dir])){
    if(getDir(snek.body, 0) != snek.dir){
      snek.body.splice(0, 0, {x:snek.body[0].x, y:snek.body[0].y})
    }
    snek.body[0].x += D_X[snek.dir]
    snek.body[0].y += D_Y[snek.dir]
    if(isFood(snek.body[0].x, snek.body[0].y, true)){
      snek.grow += INCREMENT
    }
    return false
  }
  return true
}

function moveTail(snek, collision){
  if(snek.grow > 0){
    snek.grow--
    if(!collision){
      snek.size++
    }
  }
  else if(!collision || snek.size > MIN_SIZE){
    let tail = snek.body.length - 1
    let tailDir = getDir(snek.body, tail - 1)
    snek.body[tail].x += D_X[tailDir]
    snek.body[tail].y += D_Y[tailDir]
    if(snek.body.length > 2 && snek.body[tail].x == snek.body[tail - 1].x && snek.body[tail].y == snek.body[tail - 1].y){
      snek.body.pop()
    }
    if(collision){
      snek.size--;
    }
  }
}

function getUpdateData(){
  let data = {
    food: food,
    sneks: []
  }
  for(let id in sneks){
    data.sneks.push({
      color: sneks[id].color,
      body: sneks[id].body
    })
  }
  return data
}

function update(callback){
  for(let id in sneks){
    let snek = sneks[id]
    let collision = moveHead(snek)
    moveTail(snek, collision)
  }
  callback(getUpdateData())
  setTimeout(() => update(callback), DELAY)
}
