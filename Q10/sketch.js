let song;
let img;
let fft, waveform;
let dots = [];
let frameCounter = 0;
let color1, color2;
let textX, textY, textW, textH;
let isPlaying = false;

function preload() {
  song = loadSound("audio/sample-visualisation.mp3")
  img = loadImage("https://images.pexels.com/photos/434348/pexels-photo-434348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")
}
function setup() {
  createCanvas(windowWidth, windowHeight)
  colorMode(HSB)
  imageMode(CENTER)
  img.filter(GRAY)
  img.filter(BLUR, 8)

  textX = width / 2 - 38
  textY = height * 0.95
  textSize(14)
  textW = textWidth("P l a y   -   S t o p")
  textH = 20

  fft = new p5.FFT()
  waveform = fft.waveform()
  song.connect(fft)
}

function draw() {
  background(0)

  push()
  image(img, width / 2, height / 2, img.width, img.height)
  pop()

  waveform = fft.waveform()

  let cx = width / 2
  let cy = height / 2
  for (let a = 0; a < 2 * PI; a += PI / 6) {
    let index = int(map(a, 0, 2 * PI, 0, 1024))
    let curR = abs(300 * waveform[index])
    let x = cx + 200 * cos(a)
    let y = cy + 200 * sin(a)
    
    push()
    if (frameCounter % 3000 == 0) {
      color1 = color(random(360), 100, 100)
      color2 = color(random(360), 80, 80)
    }
    frameCounter++;
    let rate = map(a, 0 , 2 * PI, 0, 1)
    let col = lerpColor(color1, color2, rate)
    fill(col)
    noStroke()
    circle(x, y, curR)
    pop()

    push()
    fill(255)
    text("P l a y   -   S t o p", textX, textY)
    pop()
    
    for (let k = 0; k < 10; k++) {
      if (random (0.01, 1) < abs(waveform[index])) {
        dots.push (new dot(x, y, curR, col))
      }
    }
  }
  
  for (let i = 0; i < dots.length; i++) {
    dots[i].move()
    dots[i].show()
    if (dots[i].z > 500) {
      dots.splice(i, 1)
    }
  }
}
function dot(x, y, z, col) {
  this.x = x + random (-1, 1)
  this.y = y + random (-1, 1)
  this.z = z
  this.col = col
  this.life = 500
  this.speedX = random (-1, 1)
  this.speedY = random (-1, 1)
  this.speedZ = 0.2 + (z - 5) / 10

  this.move = function () {
    this.x += this.speedX
    this.y += this.speedY
    this.z += this.speedZ
    this.life -= 1
  }
  this.show = function () {
    push()
    let a = map(this.life, 0, 500, 0, 1)
    stroke(hue(this.col), saturation(this.col), brightness(this.col))
    strokeWeight(2)
    point (this.x, this.y, this.z)
    pop()
  }
}

function mousePressed() {
  if (mouseX > textX && mouseX < textX + textW && mouseY > textY - textH && mouseY < textY) {
    if (isPlaying) {
      song.stop()
    } else {
      song.play()
    }
    isPlaying = !isPlaying
  }
}