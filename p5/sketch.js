let song;
let button;
let fft;
let waveform;
let stars = [];
let frameCounter = 0;
let color1, color2;

function preload() {
  song = loadSound("audio/sample-visualisation.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  button = createButton('playMusic');
  button.position(width / 2 - 30, height * 0.88);
  button.mousePressed(playSound);

  fft = new p5.FFT();
  waveform = fft.waveform();
  song.connect(fft);
}

function draw() {
  background(0);
  waveform = fft.waveform();

  let cx = width / 2;
  let cy = height / 2;
  for (let a = 0; a < 2 * PI; a += PI / 6) {
    let index = int(map(a, 0, 2 * PI, 0, 1024));
    let curR = abs(300 * waveform[index]);
    let x = cx + 200 * cos(a);
    let y = cy + 200 * sin(a);
    push();
    if (frameCounter % 3000 == 0) {
      color1 = color(random(360), 100, 100);
      color2 = color(random(360), 80, 80);
    }
    frameCounter++;
    let rate = map(a, 0 , 2 * PI, 0, 1);
    let col = lerpColor(color1, color2, rate);
    fill(col);
    noStroke();
    circle(x, y, curR);
    pop();
    
    for (let k = 0; k < 10; k++) {
      if (random (0.01, 1) < abs(waveform[index])) {
        stars.push (new star(x, y, curR, col));
      }
    }
  }
  
  for (let i = 0; i < stars.length; i++) {
    stars[i].move();
    stars[i].show();
    if (stars[i].z > 500) {
      stars.splice(i, 1);
    }
  }
}
function star(x, y, z, col) {
  this.x = x + random (-1, 1);
  this.y = y + random (-1, 1);
  this.z = z;
  this.col = col;
  this.life = 500;
  this.speedX = random (-1, 1);
  this.speedY = random (-1, 1);
  this.speedZ = 0.2 + (z - 5) / 10;

  this.move = function () {
    this.x += this.speedX;
    this.y += this.speedY;
    this.z += this.speedZ;
    this.life -= 1;
  }
  this.show = function () {
    push();
    let a = map(this.life, 0, 500, 0, 1);
    stroke(hue(this.col), saturation(this.col), brightness(this.col));
    strokeWeight(1);
    point (this.x, this.y, this.z);
    pop();
  }
}

function playSound(){
  if(!song.isPlaying()){
    song.play()
  } else {
    song.stop()
  }
}