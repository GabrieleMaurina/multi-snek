const SIZE = 100

var xScale = 1
var yScale = 1
var context = {}

const CANVAS = document.getElementById('canvas')
CANVAS.oncontextmenu = e => e.preventDefault()



function resize(){
	CANVAS.width = window.innerWidth
	CANVAS.height = window.innerHeight
	context = CANVAS.getContext('2d')

	xScale = window.innerWidth / SIZE
	yScale = window.innerHeight / SIZE

	canvas.style.width = window.innerWidth
	canvas.style.height = window.innerHeight
}
resize()

function background(){
  context.fillStyle = '#000000'
  context.fillRect(0, 0, SIZE * xScale, SIZE * yScale)
}
background()

window.addEventListener('resize', resize)
