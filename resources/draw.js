const FOOD_COLOR = '#7F7F7F'

function draw(data){
  background()
  drawSneks(data.sneks)
  drawFood(data.food)
}

function drawSneks(sneks){
  for(let index in sneks){
    let snek = sneks[index]
    context.fillStyle = snek.color
    for(let index = 0; index < snek.body.length - 1; index++){
      let xMin = Math.min(snek.body[index].x, snek.body[index + 1].x)
      let yMin = Math.min(snek.body[index].y, snek.body[index + 1].y)
      let xMax = Math.max(snek.body[index].x, snek.body[index + 1].x)
      let yMax = Math.max(snek.body[index].y, snek.body[index + 1].y)

      let x = xMin * xScale
      let y = yMin * yScale
      let dx = xMax * xScale - x + xScale
      let dy = yMax * yScale - y + yScale

      context.fillRect(x, y, dx, dy)
    }
  }
}

function drawFood(food){
  for(let index in food){
    context.fillStyle = FOOD_COLOR
    context.beginPath()
    context.ellipse(
      food[index].x * xScale + xScale / 2,
      food[index].y * yScale + yScale / 2,
      xScale / 2, yScale / 2, 0, 0, 2 * Math.PI)
    context.fill()
  }
}
