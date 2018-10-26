export default class Renderer {
  constructor(game, unit, canvas) {
    this.game = game
    this.unit = unit
    this.canvas = canvas
    this.context = canvas.getContext('2d')
  }
  
  draw(ticks) {
    this.drawSnake(ticks)
    this.drawGoal()
  }
  
  drawSnake(ticks) {
    let unit = this.unit, dests = this.game.snake.dests
    for(let part of this.game.snake.parts) {
      part.dX += ticks*dests[part.to].xDir
      part.dY += ticks*dests[part.to].yDir
      
      //set max values for dX and dY based on their position and destination
      if((part.dX + unit*(part.x - dests[part.to].x))*dests[part.to].xDir > 0) {
        part.dX = dests[part.to].x*unit - part.x*unit
      } else if((part.dY + unit*(part.y - dests[part.to].y))*dests[part.to].yDir > 0) {
        part.dY = dests[part.to].y*unit - part.y*unit
      }
      
      this.context.beginPath()
      this.context.fillStyle = part.color
      this.context.arc(
        part.x*unit + unit/2 + part.dX,
        part.y*unit + unit/2 + part.dY, 
        unit/2, 0, 2*Math.PI
      )
      this.context.fill()
    }
  }
  
  drawGoal() {
    let goal = this.game.goal, unit = this.unit
    this.context.beginPath()
    this.context.fillStyle = this.game.goal.color
    this.context.arc(goal.x*unit + unit/2, goal.y*unit + unit/2, unit/2, 0, 2*Math.PI)
    this.context.fill()
  }
  
  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}