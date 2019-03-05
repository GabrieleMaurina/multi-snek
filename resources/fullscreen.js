if('ontouchstart' in window){
  window.onclick = fullscreen
  window.ontouchstart = fullscreen
}

function fullscreen(){
  if (CANVAS.requestFullscreen) CANVAS.requestFullscreen()
  else if (CANVAS.mozRequestFullScreen) CANVAS.mozRequestFullScreen()
  else if (CANVAS.webkitRequestFullscreen) CANVAS.webkitRequestFullscreen()
  else if (CANVAS.msRequestFullscreen) CANVAS.msRequestFullscreen()
  screen.orientation.lock('landscape')
}
