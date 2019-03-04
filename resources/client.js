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
