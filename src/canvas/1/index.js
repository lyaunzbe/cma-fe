import React from 'react'
import SketchP5 from 'react-p5'

const pallete = ['#f94144', '#f3722c', '#f8961e', '#f9844a', '#f9c74f', '#90be6d', '#43aa8b', '#4d908e', '#577590', '#277da1']
const sep = 5

export default (props) => {
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(800, 800).parent(canvasParentRef)
    p5.colorMode(p5.HSB, 255, 100, 100, 100)
  }

  const draw = (p5) => {
    p5.randomSeed(props.seed)
    p5.noiseSeed(props.seed * (Math.random() * 100))
    p5.random(pallete)
    p5.drawingContext.shadowColor = p5.color(p5.random(pallete))
    p5.drawingContext.shadowBlur = 100
    p5.drawingContext.shadowOffsetY = 100
    p5.drawingContext.shadowOffsetX = 1

    for (let y = -p5.height / 2; y < p5.height; y += p5.height / 15) {
      let c1 = p5.random(pallete)
      let c2 = p5.random(pallete)
      let c3 = p5.random(pallete)
      while (c1 === c2 || c2 === c3 || c3 === c1) {
        c1 = p5.random(pallete)
        c2 = p5.random(pallete)
        c3 = p5.random(pallete)
      }
      const gradient = p5.drawingContext.createLinearGradient(0, 0, p5.width, 0)

      gradient.addColorStop(0.0, c1)
      gradient.addColorStop(p5.random(0.35, 0.7), c2)
      gradient.addColorStop(1.0, c3)

      p5.drawingContext.fillStyle = gradient

      p5.strokeWeight(4)
      p5.stroke('rgba(50%,70%,100%,0.2)')
      p5.beginShape()
      for (let x = -200; x <= p5.width + 200; x += 3) {
        const yy = y + p5.map(p5.noise(100 + y, x / 200, p5.frameCount / 10), 1, 2, p5.height / sep, -p5.height / sep)
        p5.vertex(yy, x)
      }
      p5.vertex(p5.height, p5.width + 200)
      p5.vertex(p5.height, 0 - 200)
      p5.endShape()
    }
  }

  return <SketchP5 data- setup={setup} draw={draw} />
}
