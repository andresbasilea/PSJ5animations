let player;
let floorRemainingLife;
let resetButton; 


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


    apple = new Eatable(width/5, height - (height/8));
    apple2 = new Eatable(width/4, height - (height/8));
    //player.groundY = player.boundaryY + player.boundaryHeight; 

    music.playSound();
    

}

function draw() {
    image(bg, 0, 0, width, height); 

    floorRemainingLife = floor(player.remainingLife)
    if(floorRemainingLife > 12){
      floorRemainingLife = 12;
    }
    if(floorRemainingLife <= 0){
      floorRemainingLife = 0;
    }

    // REMAINING LIFE
    text('Cadera', 60, 50);
    image(remainingLifeImages[floorRemainingLife], 50, 50);
    almendraSays.resize(220,300);

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

    if(floorRemainingLife == 0){
      
      push();
      textSize(50)
      let bbox = font.textBounds('Perdiste. Reemplazo total de cadera inminente', width/6, height/2);
      rect(bbox.x, bbox.y, bbox.w + 50, bbox.h + 50);
      text("REEMPLAZO TOTAL DE CADERA INMINENTE :(", width/6 + 25, height/2 +25)
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