import Renderer from './renderer.js'
import Game from './game.js'

//get DOM elements and set constants
let canvas = document.getElementById('canvas')
let $score = document.getElementById('score')
let $speed = document.getElementById('speed')
let $death = document.getElementById('death')
let $info = document.getElementById('info')

//unit represents one "tile" of the board; -4 for border and -32 for text
let size = 30, unit = Math.floor((document.body.scrollHeight - 36) / size)
if(unit % 2) unit--
canvas.width = unit * size
canvas.height = unit * size

canvas.style.display = 'block'
$info.style.display = 'flex'

let game = new Game(size, size), renderer = new Renderer(game, unit, canvas)

let xDir, yDir
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowLeft':  if(!xDir) { xDir = -1; yDir =  0 } break
    case 'ArrowRight': if(!xDir) { xDir =  1; yDir =  0 } break
    case 'ArrowUp':    if(!yDir) { xDir =  0; yDir = -1 } break
    case 'ArrowDown':  if(!yDir) { xDir =  0; yDir =  1 } break
    default: return
  }
  game.changeDirection(xDir, yDir)
})

let score = 0
function end() {
  xDir = yDir = 0
  $death.style.display = 'block'
  $death.style.fontSize = (20 + score) + 'px'
  setTimeout(() => { $death.style.opacity = '0' }, 0)
  setTimeout(() => { $death.removeAttribute('style') }, 5000)
}

let speed = 4, lastUpdateTime = window.performance.now()
function update(time) {
  //ideally one tick per second/speed
  let ticks = Math.floor((time - lastUpdateTime)/(1000/speed))
  if(ticks) {
    lastUpdateTime = time
    let previous = game.goal
    for(let i = 0; i < ticks; i++) {
      let playing = game.tick()
      if(!playing) {
        //display loss and reset DOM
        end()
        $score.innerHTML = score = 0
        $speed.innerHTML = speed = 4
        return
      }
    }
    if(previous !== game.goal) {
      //update DOM for speed and score
      score++
      $score.innerHTML = score
      if(score % 3 === 1) {
        speed += 3
        $speed.innerHTML = speed
      }
    }
  }
}

let lastDrawTime = window.performance.now()
function draw(time) {
  //ideally animate each pixel but we might have to skip (hence why ticks passed)
  let ticks = (time - lastDrawTime)/(1000/speed/unit)
  if(ticks) {
    lastDrawTime = time
    renderer.clear()
    renderer.draw(ticks)
  }
}

function loop(time) {
  window.requestAnimationFrame(loop)
  update(time)
  draw(time)
}
window.requestAnimationFrame(loop)