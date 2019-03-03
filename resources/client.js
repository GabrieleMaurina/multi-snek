const UP = 0
const DOWN = 1
const RIGHT = 2
const LEFT = 3

const FOOD_COLOR = '#FFFFFF'

const MIN_TOUCH_MOVEMENT = 50

const SOCKET = io(window.location.href)

SOCKET.on('connect', function(){
  console.log('connected')
})

SOCKET.on('update', function(data){
  draw(data)
})

SOCKET.on('disconnect', function(){
  console.log('disconnected')
})
