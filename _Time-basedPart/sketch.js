let Imagebg;  
let slope = (600 - 380) / (100 - 0); // Slope calculation for the linear equation of the character's walking path
let intercept = 380; // The intercept is used to determine the start point of the character's walking path
let legStatus; // The status of the character's legs, used to dynamically display the walking motion
let particles = []; // An array of particles to store the pixelated particle data
let particleSize = 8; // The size of the particles, used to pixelate the image

function preload() {
  Imagebg = loadImage("Images/Edvard_Munch_The_Scream.jpeg"); 
}

function setup() {
  createCanvas(810, 1024); 
  Imagebg.loadPixels();
  pixelateImage(); 
}

function draw() {
  background(220); // Make background gray
  image(Imagebg, 0, 0); 
  for (let i = 0; i < particles.length; i++) {
    particles[i].display(); // Iterate through the particle array and display each particle
  }
  // Define the coordinates of the start and end points of the line segments (where the bridge is located)
  let originX = 0;
  let originY = 380;
  let line1EndX = 810;
  let line1EndY = 870;
  let line2EndX = 0;
  let line2EndY = 1024;
  // Calculate the angle between two line segments and the x-axis, atan2() reference: https://p5js.org/reference/#/p5/atan2
  let angle1 = atan2(line1EndY - originY, line1EndX - originX);
  let angle2 = atan2(line2EndY - originY, line2EndX - originX);
  // Line width and quantity
  let lineWidth = 8;  
  let numLines = 600;  

  push();
  strokeWeight(lineWidth); 
  drawRandomLines(originX, originY, angle1, angle2, numLines); 
  // Calculate the x-coordinate of the character based on the current frame number
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

// >>> Now use time variable and sine function to calculate length and angle

function drawRandomLines(originX, originY, angle1, angle2, numLines) {
  // Calculate a time-based variable to control the animation over time
  let time1 = frameCount * 0.01; 

  for (let i = 0; i < numLines; i++) {
    // Determine the angle and length of each line, 
    // using sine and cosine function for smooth oscillation and changes over time
    let angle = map(sin(time1 + i), -1, 1, angle1, angle2);
    let length = map(cos(time1 + i), -1, 1, 20, 1500);

    // Calculate the end X,Y coordinate of the line based on its angle and length
    let endX = originX + length * cos(angle);
    let endY = originY + length * sin(angle);

    lineSegment(originX, originY, endX, endY); // Draw random lines in the sector
  }
}

function lineSegment(x1, y1, x2, y2) {
  let d = dist(x1, y1, x2, y2); // Calculate the distance between the start and end of the random line
  let start = 0; // Initialise the start position of the line drawing
  let time2 = frameCount * 0.02; // used to influence the noise function

  while (start < d) {  
    /*
    let segLength = random(10, 20); 
    // Keep drawing line segments until you have drawn the entire line
    */
    // Use a noise function to generate a random variable for the length of the line segments to create a more natural visual effect
    let n = noise(time2); 
    // Maps the noise value n, ranging from 0 to 1, to from 10 to 20
    let segLength = map(n, 0, 1, 10, 20); 
    // Calculate the interpolation ratio of the start and end points of the current segment, 
    // and use this to calculate the coordinates.
    let a = start / d;
    let b = (start + segLength) / d;
    let startX = lerp(x1, x2, a);
    let startY = lerp(y1, y2, a);
    let endX = lerp(x1, x2, b);
    let endY = lerp(y1, y2, b);
    // Get the colour of the coordinates of the midpoint of the line in the background image
    let midX = (startX + endX) / 2; 
    let midY = (startY + endY) / 2; 
    let col = Imagebg.get(midX, midY); 
    // Adjust to translucent for a more pronounced flow effect
    col[3] = 150;  
    stroke(col); 
    line(startX, startY, endX, endY);

    start += segLength; // update the next segment start position
    time2 += 0.05; // update the time variable for the next noise calculation
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
  // Determine the scaling factor based on the y-coordinate to simulate a near and far effect, 
  // the larger the y, the further away the character is and the larger the scaling
  let scaleFactor = map(y, 300, 1800, 1, 20); 
  push();
  translate(x, y); 
  scale(scaleFactor); 
  noStroke();
  fill(108, 92, 59);
  // Draw the head and body of the little man on the right
  ellipse(0, -30, 10, 12);
  ellipse(0, -5, 20, 45);
  // Draw legs and make them move
  stroke(108, 92, 59);
  strokeWeight(3);
  if(legStatus == 0) {
    // First leg state: one leg in front, the other behind
    line(-2, 17, -2, 35);
    line(2, 17, 2, 39);
    stroke(48, 58, 68);
    line(8, 33, 8, 50);
    line(12, 33, 12, 54);
    legStatus++;
  } else {
    // Second leg state: the legs are in opposite positions, simulating another gait of walking
    line(-2, 17, -5, 35);
    line(2, 17, 5, 39);
    stroke(48, 58, 68);
    line(8, 33, 5, 50);
    line(12, 33, 15, 54);
    // Reset to return to the first position state at the next call
    legStatus=0;
  }
  // Draw the head and body of the villain on the left
  noStroke();
  fill(48, 58, 68);
  ellipse(10, -10, 10, 12);
  ellipse(10, 15, 20, 45);
  pop();
}

// Define a particle class to store the properties of the particle
class Particle {
  constructor(x, y, col) {
    this.x = x;
    this.y = y;
    this.col = col; 
  }
  display() {
    noStroke();
    fill(this.col);
    // Draw a square at the coordinates of the particle to pixelate the background
    rect(this.x, this.y, particleSize, particleSize); 
  }
}

function pixelateImage() {
  // Build particles by iterating each pixel of the image
  for (let y = 0; y < Imagebg.height; y += particleSize) {
    for (let x = 0; x < Imagebg.width; x += particleSize) {
      // Compute the index of the pixels array, retrieve the red, green and blue colour components, 
      // reference: https://p5js.org/reference/#/p5/pixels
      let index = (x + y * Imagebg.width) * 4;
      // Get the RGBA value of the pixel
      let r = Imagebg.pixels[index];
      let g = Imagebg.pixels[index + 1];
      let b = Imagebg.pixels[index + 2];
      let col = color(r, g, b);
      // Make sure the pixel is in the area above the bridge, add it as a particle to the array
      if (y < 380 + (x / 810) * 490) {
        particles.push(new Particle(x, y, col));
      }
    }
  }
}
