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
