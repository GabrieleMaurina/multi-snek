const MIN_TOUCH_MOVEMENT = 50

var xTouchStart = 0
var yTouchStart = 0

var xTouchMove = 0
var yTouchMove = 0

canvas.addEventListener('touchstart', function (e) {
  xTouchStart = e.touches[0].clientX
  yTouchStart = e.touches[0].clientY
}, false)

canvas.addEventListener('touchmove', function (e) {
  xTouchMove = e.touches[0].clientX
  yTouchMove = e.touches[0].clientY
}, false)

canvas.addEventListener('touchend', function (e) {
  let dX = xTouchMove - xTouchStart
  let dY = yTouchMove - yTouchStart

  if(Math.max(Math.abs(dX), Math.abs(dY)) > MIN_TOUCH_MOVEMENT)
    if(Math.abs(dX) > Math.abs(dY))
      if(dX > 0) SOCKET.emit('dir', RIGHT)
      else SOCKET.emit('dir', LEFT)
    else
      if(dY > 0) SOCKET.emit('dir', DOWN)
      else SOCKET.emit('dir', UP)
}, false)
