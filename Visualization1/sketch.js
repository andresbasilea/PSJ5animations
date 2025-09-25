// Pendulum Wave Effect

// by Steve Kranz, 2015

// stevecrayons@gmail.com

// www.stevecrayons.com

//

// Licensed under Creative Commons 0 Universal 1.0 -- Public Domain. Feel free to do whatever with this code. If you do use it, I'd love to see what you did. Send me a note at stevecrayons@gmail.com



let frequencies; // Holds the frequencies of each pendulum

let positions;   // Holds the position of the balls that simulate the pendulum bobs

let amplitude;        // How far left and right the balls move

let freqMult = 0.001; // This frequency multiplier makes the system complete a whole period in 1000 frames.

let totalPen;         // The total number of pendulums/balls



let total20 = true;   // Are there 20 balls? If false, there are 40.

let prevTotal20 = true; // Is the value of total20 on the previous frame 20? This is for switching between 20 and 40 pendulums.

let xPos, yPos;       // x- and y-positions of the pendulums



let xCenter;          // For aligning the systems of pendulums in the x-direction

let boxHeight;        // The y-height of the invisible box that the balls exist in; for display purposes.



const two_pi = 6.283185307;



// Drawing options

let draw1 = true;

let draw2 = true;

let draw3 = true;

let drawBalls = true;

let alignSin = true;



// TIME

let timeValue = 0;

let timeSpeed = 1;



let debugOn = false;



// BUTTONS

let clickCount = 0; // so a button is activated only once per click

let ballButton, numBallsButton, line1Button, line2Button, line3Button, labelButton;

let pauseButton, speedButton;


function preload(){
  sound = loadSound('https://upload.wikimedia.org/wikipedia/commons/1/17/Antonin_Dvorak_-_symphony_no._9_in_e_minor_%27from_the_new_world%27%2C_op._95_-_iv._allegro_con_fuoco.ogg');
}



function setup() {

  let cnv = createCanvas(720, 720);

  frameRate(30);

  amplitude = width / 8;

  setupPendulum();

  setupButtons();

  cnv.mouseClicked(togglePlay);
  fft = new p5.FFT();
  sound.amp(0.2);

}



function draw() {

  background(255, 255, 255);



  // Buttons...

  displayButtons();

  displayButtonLabels();

  displayTitle();

  displayPhaseCircle();



  if (debugOn) {

    debug();

  }



  calculatePositions();



  if (labelButton.state) {

    drawGuides();

    drawLabels();

  }



  if (line3Button.state) {

    drawLine(3, color(230, 180, 70));

  }

  if (line2Button.state) {

    drawLine(2, color(230, 115, 70));

  }

  if (line1Button.state) {

    drawLine(1, color(230, 70, 65));

  }



  setBobColor();



  if (ballButton.state) {

    // This loop draws the 'bobs'.

    for (let i = 0; i < totalPen; i++) {

      ellipse(positions[i].x, positions[i].y, 18, 18);

    }

  }



  totalPenChange();



  incrementTime();

  let spectrum = fft.analyze();
  noStroke();
  fill(255, 0, 255);
  for (let i = 0; i< spectrum.length; i++){
    let x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width / spectrum.length, h )
  }

  let waveform = fft.waveform();
  noFill();
  beginShape();
  stroke(20);
  for (let i = 0; i < waveform.length; i++){
    let x = map(i, 0, waveform.length, 0, width);
    let y = map( waveform[i], -1, 1, 0, height);
    vertex(x,y);
  }
  endShape();


} // end draw

function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}



class Button {

  constructor(x_, y_, w_, h_, label_, shortcut_) {

    this.x = x_;

    this.y = y_;

    this.w = w_;

    this.h = h_;

    this.label = label_;

    this.shortcut = shortcut_;

    this.state = true;

    textSize(16);

    this.labelWidth = textWidth(this.label);



    this.onColorFore = color(0, 100);

    this.onColorBack = color(100, 100);



    this.offColorFore = color(0, 100);

    this.offColorBack = color(100, 180);



    this.onText = "on";

    this.offText = "off";

  }



  update() {

    if (clickCount === 0) {

      if (this.over()) {

        if (mouseIsPressed) {

          this.state = !this.state;

          clickCount++;

        }

      }

    }

    this.display();

  }



  display() {

    textAlign(CENTER, CENTER);

    textSize(16);



    if (this.state === true) {

      noStroke();

      fill(this.onColorBack);

      rect(this.x, this.y, this.w, this.h);

      fill(this.onColorFore);

      text(this.onText, this.x + this.w / 2, this.y + this.h / 2);

    } else {

      noStroke();

      fill(this.offColorBack);

      rect(this.x, this.y, this.w, this.h);

      fill(this.offColorFore);

      text(this.offText, this.x + this.w / 2, this.y + this.h / 2);

    }



    textAlign(LEFT, CENTER);



    if (this.state) {

      fill(0, 160);

    } else {

      fill(0, 80);

    }

    text(this.label, this.x + this.w + 6, this.y + this.h / 2);



    textAlign(CENTER, CENTER);

    text(this.shortcut, this.x - 28, this.y + this.h / 2);

  }



  over() {

    if (mouseX >= this.x - 33 && mouseX <= this.x + this.w + 6 + this.labelWidth && mouseY >= this.y && mouseY <= this.y + this.h) {

      return true;

    } else {

      return false;

    }

  }

}



function setBobColor() {

  // stroke(10);

  noStroke();

  fill(0, 100);

  strokeWeight(1);

}



// This function draws lines that connect the pendulums

function drawLine(n, c) {

  strokeWeight(4);

  stroke(c);

  for (let i = 0; i < totalPen - n; i++) {

    line(positions[i].x, positions[i].y, positions[i + n].x, positions[i + n].y);

  }

}



// This function allows time to progress at a slow or fast rate, or pause

function incrementTime() {

  if (pauseButton.state === false) {

    if (speedButton.state === false) {

      timeValue += timeSpeed;

    } else {

      timeValue += timeSpeed * 2;

    }

  }

}



// This function sets up the frequency and position arrays for the pendulums

function setupPendulum() {

  xCenter = 6 * width / 10 + 85;

  boxHeight = height - 25;



  if (total20) {

    totalPen = 20;

    freqMult = 0.001;

  } else {

    totalPen = 40;

    freqMult = 0.0005;

  }



  frequencies = new Array(totalPen);

  positions = new Array(totalPen);



  for (let i = 0; i < totalPen; i++) {

    frequencies[i] = (i + 1) * freqMult;

  }

}



// Has the state of the "Number of pendulums" button changed? If so, run the setupPendulum() function

function totalPenChange() {

  total20 = numBallsButton.state;

  if (total20 !== prevTotal20) {

    setupPendulum();

  }

  prevTotal20 = total20;

}



// Draw the horizontal lines underneath each of the pendulums

function drawGuides() {

  strokeWeight(1);

  stroke(0, 80);

  for (let i = 0; i < totalPen; i++) {

    line(xCenter - amplitude, positions[i].y, xCenter + amplitude, positions[i].y);

  }

}



// Draw the text labels above and two the right of the pendulums

function drawLabels() {

  textSize(12);

  fill(0, 89);

  for (let i = 0; i < totalPen; i++) {

    textAlign(CENTER, CENTER);

    text(i + 1, xCenter + amplitude + 27, positions[i].y);

  }



  let yOffset;



  if (total20) {

    yOffset = 20;

  } else {

    yOffset = 15;

  }

  text("freq.", xCenter + amplitude + 27, yOffset);

  text("pendulum", xCenter, yOffset);

}



// Draw the title information in the upper-righthand corner

function displayTitle() {

  let x = 110;

  let y = 40;



  textSize(30);

  textAlign(LEFT, TOP);

  fill(0, 100);

  textLeading(32);

  text("Pendulum\nWave Effect", x, y);

  fill(0, 89);

  text("Pendulum\nWave Effect", x + 1, y);



  fill(90, 91);

  textSize(14);

  text("by Steve Kranz, 2015. \n Modified by Andrés Basile", x, y + 67);

  textSize(12);

}



// setup the buttons used to control the simulation.

function setupButtons() {

  const x = 110;

  const y = 210;

  const w = 40;

  const h = 30;

  const yGap = 32;

  const drawGap = 0;



  ballButton = new Button(x, y + yGap * 0 + drawGap, w, h, "pendulums", "0");

  numBallsButton = new Button(x, y + yGap * 4 + 8, w, h, "number of pendulums", "N");

  numBallsButton.onText = "20";

  numBallsButton.offText = "40";

  line1Button = new Button(x, y + yGap * 1 + drawGap, w, h, "line 1", "1");

  line2Button = new Button(x, y + yGap * 2 + drawGap, w, h, "line 2", "2");

  line3Button = new Button(x, y + yGap * 3 + drawGap, w, h, "line 3", "3");

  labelButton = new Button(x, y + yGap * 5 + drawGap + 8, w, h, "labels", "L");

  // labelButton.state = false;

  pauseButton = new Button(x, y + yGap * 6 + 70, w, h, "pause", "P");

  pauseButton.state = false;

  speedButton = new Button(x, y + yGap * 7 + 70, w, h, "speed", "S");

  speedButton.onText = "fast";

  speedButton.offText = "slow";

  speedButton.state = false;

}



// Draw the labels that annotate the buttons

function displayButtonLabels() {

  // x and y should match x and y in setupButtons();

  const x = 110;

  const y = 210;



  textSize(16);

  fill(0, 100);

  textAlign(LEFT, TOP);

  text("Drawing options", x, y - 30);

  text("Timing options", x, y + 232);



  textAlign(CENTER, TOP);

  textSize(12);

  textLeading(11);

  fill(0, 100);

  text("short\ncut", x - 30, y - 32);



  stroke(0, 100);

  strokeWeight(1);

  line(x, y - 9, x + 220, y - 9);

  line(x, y + 253, x + 130, y + 253);

}



function displayButtons() {

  ballButton.update();

  numBallsButton.update();

  line1Button.update();

  line2Button.update();

  line3Button.update();

  labelButton.update();

  pauseButton.update();

  speedButton.update();

}



// This circle simply displays the phase of the system. When the indictor line makes a complete revolution, the pendulum-system repeats itself.

function displayPhaseCircle() {

  const x = 163;

  const y = 640;

  const d = 60;

  const angle = timeValue * freqMult * two_pi - two_pi / 4;



  textSize(16);

  textAlign(LEFT, CENTER);

  fill(0, 255);

  text("Phase", 110, y - d / 2 - 35);



  stroke(0, 70);

  strokeWeight(1);

  line(110, y - d / 2 - 24, 110 + 105, y - d / 2 - 24);



  strokeWeight(1);

  stroke(0, 200);

  fill(0, 100);

  ellipseMode(CENTER);

  ellipse(x, y, d, d);



  // Tick marks

  strokeWeight(1);

  stroke(0, 200);

  const tick = 0.8;

  line(x, y - tick * d / 2, x, y - d / 2); // zero or two-pi (top of circle);

  line(x + tick * d / 2, y, x + d / 2, y); // pi/2

  line(x, y + tick * d / 2, x, y + d / 2); // pi

  line(x - tick * d / 2, y, x - d / 2, y); // 3pi/2



  textSize(12);

  fill(0, 200);

  textAlign(CENTER, CENTER);

  text("0", x + 1, y - d / 2 - 10);

  text("π", x, y + d / 2 + 8);



  // 3pi/2 on two lines so it looks nicer

  text("3π", x - d / 2 - 14, y - 8);

  text("2", x - d / 2 - 14, y + 6);

  stroke(0, 200);

  strokeWeight(1);

  line(x - d / 2 - 22, y, x - d / 2 - 6, y);



  // pi/2 on two lines so it looks nicer

  text("π", x + d / 2 + 12, y - 8);

  text("2", x + d / 2 + 12, y + 6);

  stroke(0, 200);

  strokeWeight(1);

  line(x + d / 2 + 18, y, x + d / 2 + 6, y);



  // Indicating line...the vertical spacing will depend on how the font is rendered...can be iffy.

  strokeWeight(2);

  stroke(0, 200);

  line(x, y, x + (d / 2) * cos(angle), y + (d / 2) * sin(angle));

}



function debug() {

  fill(255);

  textSize(12);

  textAlign(LEFT);

  text("FPS: " + nf(frameRate(), 2, 1), 12, 15);

  text("frame number: " + frameCount, 12, 27);

  text("time value: " + nfc(timeValue, 1), 12, 39);

  text("Hit 'D' to hide.", 12, 51);

}



function calculatePositions() {

  // This loop calculates the position of all the 'bobs' (or "balls" or "pendulums") for this current frame

  for (let i = 0; i < totalPen; i++) {

    yPos = (i + 1) * (boxHeight / (totalPen + 1)) + 25;

    if (alignSin === true) {

      xPos = xCenter + amplitude * sin(frequencies[i] * timeValue * two_pi);

    } else {

      xPos = xCenter + amplitude * cos(frequencies[i] * timeValue * two_pi);

    }

    positions[i] = createVector(xPos, yPos);

  }

}



function keyPressed() {

  if (key === '1') {

    line1Button.state = !line1Button.state;

  }



  if (key === '2') {

    line2Button.state = !line2Button.state;

  }

  if (key === '3') {

    line3Button.state = !line3Button.state;

  }

  if (key === '`' || key === '0') {

    ballButton.state = !ballButton.state;

  }

  if (key === ' ' || key === 'p' || key === 'P') {

    pauseButton.state = !pauseButton.state;

  }



  if (key === 's' || key === 'S') {

    speedButton.state = !speedButton.state;

  }



  if (key === 'n' || key === 'N') {

    numBallsButton.state = !numBallsButton.state;

  }



  if (key === 'l' || key === 'L') {

    labelButton.state = !labelButton.state;

  }

  if (key === 'd' || key === 'D') {

    debugOn = !debugOn;

  }

  if (key === 'r' || key === 'R') {

    saveCanvas();

  }

  if (key === 'q' || key === 'Q') {

    alignSin = !alignSin;

  }

}



function mouseReleased() {

  clickCount = 0;

}