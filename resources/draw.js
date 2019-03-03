function draw(data){
  background()
  for(let index in data.sneks){
    let snek = data.sneks[index]
    context.fillStyle = snek.color
    for(let position = 0; position < snek.body.length - 1; position++){
      let xMin = Math.min(snek.body[position].x, snek.body[position + 1].x)
      let yMin = Math.min(snek.body[position].y, snek.body[position + 1].y)
      let xMax = Math.max(snek.body[position].x, snek.body[position + 1].x)
      let yMax = Math.max(snek.body[position].y, snek.body[position + 1].y)

      let x = xMin * xScale
      let y = yMin * yScale
      let dx = xMax * xScale - x + xScale
      let dy = yMax * yScale - y + yScale

      context.fillRect(x, y, dx, dy)
    }
  }
  for(let index in data.food){
    context.fillStyle = FOOD_COLOR
    context.beginPath()
    context.ellipse(data.food[index].x * xScale + xScale / 2, data.food[index].y * yScale + yScale / 2, xScale / 2, yScale / 2, 0, 0, 2 * Math.PI)
    context.fill()
  }
}
