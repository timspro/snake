function getRandomColor() {
  let letters = '456789ABCDEF', color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)]
  }
  return color
}

export default class Game {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.initSnake()
    this.initGoal()
  }
  
  initSnake() {
    //place snake in the middle
    this.snake = {
      dests: [],
      parts: [{
        color: 'white',
        to: -1,
        x: this.width/2,
        y: this.height/2,
        dX: 0,
        dY: 0
      }]
    }
    //game expects there always to be a destination even when not moving
    this.changeDirection(0, 0)
    console.log('SNAKE', this.snake)
  }

  initGoal() {
    let valid = false
    while(!valid) {
      //place goal randomly on board
      this.goal = {
        x: Math.floor(Math.random() * this.width),
        y: Math.floor(Math.random() * this.height),
        color: getRandomColor()
      }
      console.log('GOAL', this.goal)
      //check that we don't place the goal on the snake
      valid = true
      for(let part of this.snake.parts) {
        if(part.x === this.goal.x || part.y === this.goal.y) {
          valid = false
          break
        }
      }
    }
  }
  
  changeDirection(xDir, yDir) {
    let head = this.snake.parts[0], first = this.snake.dests[0]
    //add a new destination that the head will go to
    this.snake.dests.unshift({
      xDir,
      yDir,
      x: (first || head).x + xDir,
      y: (first || head).y + yDir
    })
    //everything else goes to previous destinations
    for(let part of this.snake.parts) part.to++
  }
  
  tick(unit) {
    //move parts and check if any part has reached its destination
    for(let part of this.snake.parts) {
      let dest = this.snake.dests[part.to]
      part.x += dest.xDir
      part.y += dest.yDir
      if(part.x === dest.x && part.y === dest.y) { 
        //if so have it go to a more recent destination
        part.to--
      }
      //reset animation
      part.dX = 0
      part.dY = 0
    }
    //possible that head doesn't have a destination
    if(this.snake.parts[0].to < 0) {
      //keep going in the current direction
      this.changeDirection(this.snake.dests[0].xDir, this.snake.dests[0].yDir)
    }
    //check that last dest is still relevant
    if(this.snake.parts[this.snake.parts.length - 1].to < this.snake.dests.length - 1) {
      this.snake.dests.pop()
    }
    
    //check goal and loss conditions
    if(this.checkGoal()) {
      this.enlargeSnake()
      this.initGoal()
    } else if(this.checkSidesLoss() || this.checkSnakeLoss()) {
      this.initSnake()
      this.initGoal()
      return false
    }
    return true
  }
  
  enlargeSnake() {
    let lastPart = this.snake.parts[this.snake.parts.length - 1]
    let lastDest = this.snake.dests[lastPart.to]
    this.snake.parts.push({
      color: this.goal.color,
      to: lastPart.to,
      x: lastPart.x - lastDest.xDir,
      y: lastPart.y - lastDest.yDir,
      dX: 0,
      dY: 0
    })
  }
  
  checkGoal() {
    let head = this.snake.parts[0]
    return head.x === this.goal.x && head.y === this.goal.y
  }
  
  checkSidesLoss() {
    let head = this.snake.parts[0]
    return head.x < 0 || head.x >= this.width || head.y < 0 || head.y >= this.height
  }
  
  checkSnakeLoss() {
    let head = this.snake.parts[0]
    for(let i = 3; i < this.snake.parts.length; i++) {
      let part = this.snake.parts[i]
      if(head.x === part.x && head.y === part.y) return true
    }
    return false
  }
}