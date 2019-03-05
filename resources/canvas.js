const X_SIZE = 160
const Y_SIZE = 90

var xScale = 1
var yScale = 1
var context = {}

const CANVAS = document.getElementById('canvas')
CANVAS.oncontextmenu = e => e.preventDefault()

function resize(){
	CANVAS.width = window.innerWidth
	CANVAS.height = window.innerHeight
	context = CANVAS.getContext('2d')

	xScale = window.innerWidth / X_SIZE
	yScale = window.innerHeight / Y_SIZE

	canvas.style.width = window.innerWidth
	canvas.style.height = window.innerHeight
}
resize()

function background(){
  context.fillStyle = '#000000'
  context.fillRect(0, 0, X_SIZE * xScale, Y_SIZE * yScale)
}
background()

window.addEventListener('resize', resize)
