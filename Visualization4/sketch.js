let player;

function preload(){
  preloadSound();
  bg = loadImage('assets/images/backgrounds/summerBackground.png');

}

function setup() {
    createCanvas(windowWidth, windowHeight);

    player = new Character(100, height-100);

    player.boundaryX = 50;
    player.boundaryY = height-200;
    player.boundaryWidth = width-100;
    player.boundaryHeight = 150;


    apple = new Eatable(width/5, height - (height/8));
    player.groundY = player.boundaryY + player.boundaryHeight; 

    playMusic();

}

function draw() {
    image(bg, 0, 0, width, height); 
    player.update();
    if (player.sprite.overlap(apple.sprite) && player.isEating == true) {
        apple.startEatingAnimation(); 
    }

    player.display();
}



function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    redraw(); 

}