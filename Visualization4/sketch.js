let player;
let floorRemainingLife;
let resetButton; 
let currentWorld = 1;
let savePosition = [0,0];


function preload(){
  music = new SoundInput('music/Mahler_Symphony_No.4_in_G_major_1._Badachtig_Nicht_ellen_(Mahler)_European_Archive.ogg');
  biting = new SoundInput('soundEffects/biting2.mp3')
  bg = loadImage('assets/images/backgrounds/summerBackground.png');
  remainingLifeImages = [loadImage("assets/images/character/life1.png"),
    loadImage("assets/images/character/life2.png"),
    loadImage("assets/images/character/life3.png"),
    loadImage("assets/images/character/life4.png"),
    loadImage("assets/images/character/life5.png"),
    loadImage("assets/images/character/life6.png"),
    loadImage("assets/images/character/life7.png"),
    loadImage("assets/images/character/life8.png"),
    loadImage("assets/images/character/life9.png"),
    loadImage("assets/images/character/life10.png"),
    loadImage("assets/images/character/life11.png"),
    loadImage("assets/images/character/life12.png"),
    loadImage("assets/images/character/life13.png"),
  ];
  almendraSays = loadImage("assets/images/character/almendraSays.png");
  font = loadFont('assets/fonts/font1.otf');

  bgWorld2 = loadImage('assets/images/backgrounds/summerBackground3.png');
  


}

function setup() {
    createCanvas(windowWidth, windowHeight);

    player = new Character(100, height-100);
    floorRemainingLife = 12;

    // REMAINING LIFE
    textFont(font);
    textSize(32);

    player.boundaryX = 50;
    player.boundaryY = height-200;
    player.boundaryWidth = width-100;
    player.boundaryHeight = 150;

    setupWorld1();

    music.playSound();
    

}

function draw() {
    

    floorRemainingLife = floor(player.remainingLife)
    if(floorRemainingLife > 12){
      floorRemainingLife = 12;
    }
    if(floorRemainingLife <= 0){
      floorRemainingLife = 0;
    }

    
    almendraSays.resize(220,300);

    if(currentWorld==1){
      drawWorld1();
    }

    else if (currentWorld==2){
      drawWorld2();
    }

    // REMAINING LIFE
    text('Cadera', 60, 50);
    image(remainingLifeImages[floorRemainingLife], 50, 50);

    

    if(floorRemainingLife == 0){
      
      push();
      let bbox = font.textBounds('Perdiste. Reemplazo total de cadera inminente', width/6, height/2);
      fill(255,255,255)
      noStroke();
      rect(bbox.x-25, bbox.y-25, bbox.w + 500, bbox.h + 100);
      fill(100,200,200);
      noStroke();
      rect(bbox.x, bbox.y, bbox.w + 450, bbox.h + 50);
      textSize(50);
      fill(0);
      text("Perdiste. Almendra necesita cambio de cadera :(", width/6 + 25, height/2 +25)
      textAlign(CENTER)
      image(almendraSays, width/8, height/2)
      player.sprite.remove();
      
      if (!resetButton) {
        resetButton = createButton("Jugar de Nuevo");
        resetButton.mousePressed(resetSketch);

        // Set the position
        let buttonX = width / 2 - resetButton.width / 2;
        let buttonY = height / 2 + 100;
        resetButton.position(buttonX, buttonY);
      }

      pop();
    }


}


function setupWorld1(){
  
  currentWorld = 1;
  apple = new Eatable(width/5, height - (height/8));
  apple2 = new Eatable(width/4, height - (height/8));
  
}


function drawWorld1(){
  image(bg, 0, 0, width, height); 

  if (player.sprite.overlap(apple.sprite) && player.isEating == true) {
        apple.startEatingAnimation();
        biting.playSound();
        player.remainingLife += 1;
        apple.sprite.remove();
    }
    if (player.sprite.overlap(apple2.sprite) && player.isEating == true) {
        apple2.startEatingAnimation();
        biting.playSound();
        player.remainingLife += 1;
        apple2.sprite.remove();
    }

    player.update();

    player.display();

    if(player.sprite.position.x == width - 110){
      console.log("world 2 condition met");
      setupWorld2();
      redraw();
    }
}


function setupWorld2(){

  apple.sprite.remove();
  apple2.sprite.remove();

  console.log("setup world 2");
  currentWorld = 2;
  player.sprite.position.set(100, 50);

}

function drawWorld2(){
  background(0);
  image(bgWorld2, 0, 0, width, height); 
  player.update();

  player.display();

  if (player.sprite.position.x == 50){
    setupWorld1();
    currentWorld = 1;
    player.sprite.position.set(width-120, 50);
    redraw();
  }

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    redraw(); 

}

function resetSketch() {
  if (player && player.sprite) {
    player.sprite.remove();
  }
  player = new Character(100, height-100);

  if (resetButton) {
    resetButton.remove();
    resetButton = null; // Set to null so it can be recreated later
  }
  
  player.remainingLife = 12; 
  player.boundaryX = 50;
  player.boundaryY = height-200;
  player.boundaryWidth = width-100;
  player.boundaryHeight = 150;

  floorRemainingLife = 12;

  if (apple && apple.sprite) {
    apple.sprite.remove();
  }
  if (apple2 && apple2.sprite) {
    apple2.sprite.remove();
  }
  
  apple = new Eatable(width/5, height - (height/8));
  apple2 = new Eatable(width/4, height - (height/8));

  redraw(); 
}