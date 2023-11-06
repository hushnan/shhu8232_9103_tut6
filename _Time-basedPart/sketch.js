let Imagebg;  
let slope = (600 - 380) / (100 - 0);  
let intercept = 380;  
let legStatus;
let personCount;
let particles = [];
let particleSize = 8; 

function preload() {
  Imagebg = loadImage("Images/Edvard_Munch_The_Scream.jpeg"); 
}

function setup() {
  createCanvas(810, 1024); 
  Imagebg.loadPixels();
  pixelateImage(); 
}

function draw() {
  background(220); 
  image(Imagebg, 0, 0); 
  for (let i = 0; i < particles.length; i++) {
    particles[i].display();
  }

  let originX = 0;
  let originY = 380;
  let line1EndX = 810;
  let line1EndY = 870;
  let line2EndX = 0;
  let line2EndY = 1024;
  let angle1 = atan2(line1EndY - originY, line1EndX - originX);
  let angle2 = atan2(line2EndY - originY, line2EndX - originX);

  let lineWidth = 8;  
  let numLines = 600;  

  push();
  strokeWeight(lineWidth); 
  drawRandomLines(originX, originY, angle1, angle2, numLines); 
  let personX = (frameCount % 100);
  let personY = slope * personX + intercept;
  drawPeople(personX, personY);
  pop();
}

/* Use random function: 
function drawRandomLines(originX, originY, angle1, angle2, numLines) {

  for (let i = 0; i < numLines; i++) {  // Loop through the specified number of lines
    let angle = random(angle1, angle2); 
    let length = random(20, 1500); 

    // Calculate the end point of the line using trigonometry
    let endX = originX + length * cos(angle);
    let endY = originY + length * sin(angle);
    
    lineSegment(originX, originY, endX, endY);  // Draw the line segment
  }
}
*/

// Now use time variable and sine function to calculate length and angle

function drawRandomLines(originX, originY, angle1, angle2, numLines) {
  let time1 = frameCount * 0.01; 
  
  for (let i = 0; i < numLines; i++) {
    let angle = map(sin(time1 + i), -1, 1, angle1, angle2);
    let length = map(cos(time1 + i), -1, 1, 20, 1500);

    let endX = originX + length * cos(angle);
    let endY = originY + length * sin(angle);

    lineSegment(originX, originY, endX, endY);
  }
}

function lineSegment(x1, y1, x2, y2) {
  let d = dist(x1, y1, x2, y2); 
  let start = 0; 
  let time2 = frameCount * 0.02; 

  while (start < d) {  
    /*
    let segLength = random(10, 20); 
    */
    let n = noise(time2); 
    let segLength = map(n, 0, 1, 10, 20); 
    let a = start / d;
    let b = (start + segLength) / d;
    let startX = lerp(x1, x2, a);
    let startY = lerp(y1, y2, a);
    let endX = lerp(x1, x2, b);
    let endY = lerp(y1, y2, b);
    let midX = (startX + endX) / 2; 
    let midY = (startY + endY) / 2; 

    let col = Imagebg.get(midX, midY);
    col[3] = 150;  
    stroke(col); 
    line(startX, startY, endX, endY);

    start += segLength;  
    time2 += 0.05;  
  }
}

/* Draw two person, change their position and scale
function drawPeople(x, y) {
  // Scale between 0.8 and 2 as y goes from 380 to 600
  let scaleFactor = map(y, 380, 600, 0.8, 2); 
  
  push();
  translate(x, y);  // Translate to the position where the people will be drawn
  scale(scaleFactor);  // Apply the scaling
  noStroke();
  // Set fill color and draw ellipses for the first person
  fill(48, 58, 68);
  ellipse(78, -10, 23, 25);
  ellipse(79, 41, 42, 90);
  ellipse(68, 110, 18, 80);
  ellipse(88, 110, 18, 90);
  // Set a different fill color and draw ellipses for the second person
  fill(108, 92, 59);
  ellipse(38, -15, 25, 23);
  ellipse(39, 36, 42, 89);
  ellipse(30, 102, 17, 79);
  ellipse(48, 103, 17, 89);
  pop();
}
*/
// >>> Make them walking
function drawPeople(x, y) {
  let scaleFactor = map(y, 300, 1800, 1, 20); 
  push();
  translate(x, y); 
  scale(scaleFactor); 
  noStroke();
  fill(108, 92, 59);
  ellipse(0, -30, 10, 12);
  ellipse(0, -5, 20, 45);
  //draw legs and make it move
  stroke(108, 92, 59);
  strokeWeight(3);
  if(legStatus==0){
    //Make the legs longer in front and shorter in back
    line(-2,17,-2,35);
    line(2,17,2,39);
    stroke(48, 58, 68);
    line(8,33,8,50);
    line(12,33,12,54);
    legStatus++;
  }else{
    line(-2,17,-5,35);
    line(2,17,5,39);
    stroke(48, 58, 68);
    line(8,33,5,50);
    line(12,33,15,54);
    legStatus=0;
  }
  noStroke();
  fill(48, 58, 68);
  ellipse(10, -10, 10, 12);
  ellipse(10, 15, 20, 45);
  pop();
  personCount++;
  if(personCount>400){
    personCount=0;
  }
}

class Particle {
  constructor(x, y, col) {
    this.x = x;
    this.y = y;
    this.col = col;
  }
  display() {
    noStroke();
    fill(this.col);
    rect(this.x, this.y, particleSize, particleSize);
  }
}

function pixelateImage() {
  for (let y = 0; y < Imagebg.height; y += particleSize) {
    for (let x = 0; x < Imagebg.width; x += particleSize) {
      let index = (x + y * Imagebg.width) * 4;
      let r = Imagebg.pixels[index];
      let g = Imagebg.pixels[index + 1];
      let b = Imagebg.pixels[index + 2];
      let col = color(r, g, b);
      if (y < 380 + (x / 810) * 490) {
        particles.push(new Particle(x, y, col));
      }
    }
  }
}
