const SIZE = 100
const SCALE = 20
var X_RATIO = 1
var Y_RATIO = 1

const CANVAS = document.getElementById('canvas')
CANVAS.oncontextmenu = e => e.preventDefault()

CANVAS.width = SIZE * SCALE
CANVAS.height = SIZE * SCALE
const CONTEXT = CANVAS.getContext('2d')

function resize(){
	X_RATIO = window.innerWidth / SIZE
	Y_RATIO = window.innerHeight / SIZE

	canvas.style.width = window.innerWidth
	canvas.style.height = window.innerHeight
}
resize()

function background(){
  CONTEXT.fillStyle = '#000000'
  CONTEXT.fillRect(0, 0, SIZE * SCALE, SIZE * SCALE)
}
background()

CONTEXT.lineWidth = SCALE

window.addEventListener('resize', resize)
