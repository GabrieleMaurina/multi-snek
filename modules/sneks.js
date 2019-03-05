const DELAY = 50

const MAX_SNEKS = 8
const X_SIZE = 160
const Y_SIZE = 90
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

class Sneks{
  constructor(){
    this.sneks = {}
    this.food = []
    this.colors = []

    for(let i = 0; i < FOOD; i++) this.food.push(this.getRandomEmptyPoint())
    this.colors = COLORS.slice(0)
  }

  spawnSnek(socket){
    let c = Math.floor(Math.random() * COLORS.length)
    let x, y, dir
    do{
      x = Math.floor(Math.random() * X_SIZE / 2) + Math.floor(X_SIZE / 4)
      y = Math.floor(Math.random() * Y_SIZE / 2) + Math.floor(Y_SIZE / 4)
      dir = Math.floor(Math.random() * 4)
    }while(this.checkSnekSpawn(x, y, dir))

    this.sneks[socket.id] = {
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

  setSnekDir(socket, dir){
    dir = Math.max(Math.min(parseInt(dir), 3), 0)
    if(dir != OPPOSITE[this.getDir(this.sneks[socket.id].body, 0)]){
      this.sneks[socket.id].dir = dir
    }
  }

  disconnectSnek(socket){
    if(this.sneks[socket.id]){
      COLORS.push(this.sneks[socket.id].color)
      delete this.sneks[socket.id]
    }
  }

  update(callback){
    for(let id in this.sneks){
      let snek = this.sneks[id]
      let collision = this.moveHead(snek)
      this.moveTail(snek, collision)
    }
    callback(this.getUpdateData())
    setTimeout(() => this.update(callback), DELAY)
  }

  checkSnekSpawn(x, y, dir){
    dir = OPPOSITE[dir]
    for(let index = 0; index < MIN_SIZE; index++){
      if(this.busy(x + D_X[dir] * index, y + D_Y[dir] * index)) return true
    }
    return false
  }

  busy(x, y){
    return this.isFood(x, y) || this.collision(x, y)
  }

  isFood(x, y, replace = false){
    for(let index in this.food){
      if(this.food[index].x == x && this.food[index].y == y){
        if(replace){
          this.food[index] = this.getRandomEmptyPoint()
        }
        return true
      }
    }
    return false
  }

  getRandomEmptyPoint(){
    let x, y
    do{
      x = Math.floor(Math.random() * X_SIZE)
      y = Math.floor(Math.random() * Y_SIZE)
    }while(this.collision(x, y) || this.isFood())
    return {x:x,y:y}
  }

  getDir(body, joint){
    if(body[joint].x > body[joint + 1].x) return RIGHT
    else if(body[joint].x < body[joint + 1].x) return LEFT
    else if(body[joint].y > body[joint + 1].y) return DOWN
    else return UP
  }

  between(i, a, b){
    return i >= Math.min(a, b) && i <= Math.max(a, b)
  }

  collision(x, y, grow = false){
    if(x < 0 || y < 0 || x >= X_SIZE || y >= Y_SIZE){
      return true
    }
    for(let id in this.sneks){
      let body = this.sneks[id].body
      for(let i = 0; i < body.length - 1; i++){
        if((x == body[i].x && this.between(y, body[i].y, body[i + 1].y)) || (y == body[i].y && this.between(x, body[i].x, body[i + 1].x))){
          if(grow){
            this.sneks[id].grow++
          }
          return true
        }
      }
    }
    return false
  }

  moveHead(snek){
    if(!this.collision(snek.body[0].x + D_X[snek.dir], snek.body[0].y + D_Y[snek.dir])){
      if(this.getDir(snek.body, 0) != snek.dir){
        snek.body.splice(0, 0, {x:snek.body[0].x, y:snek.body[0].y})
      }
      snek.body[0].x += D_X[snek.dir]
      snek.body[0].y += D_Y[snek.dir]
      if(this.isFood(snek.body[0].x, snek.body[0].y, true)){
        snek.grow += INCREMENT
      }
      return false
    }
    return true
  }

  moveTail(snek, collision){
    if(snek.grow > 0){
      snek.grow--
      if(!collision){
        snek.size++
      }
    }
    else if(!collision || snek.size > MIN_SIZE){
      let tail = snek.body.length - 1
      let tailDir = this.getDir(snek.body, tail - 1)
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

  getUpdateData(){
    let data = {
      food: this.food,
      sneks: []
    }
    for(let id in this.sneks){
      data.sneks.push({
        color: this.sneks[id].color,
        body: this.sneks[id].body
      })
    }
    return data
  }
}

module.exports = {
  Sneks
}
