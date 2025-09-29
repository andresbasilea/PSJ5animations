class Character {
    constructor(x, y) {
        this.sprite = createSprite(x, y);
        this.sprite.addAnimation("idle", "assets/images/character/idle.png");
        this.sprite.addAnimation("walk", "assets/images/character/walk1.png", "assets/images/character/walk2.png", "assets/images/character/walk3.png");
        this.sprite.addAnimation("eat", "assets/images/character/eat1.png", "assets/images/character/eat2.png", "assets/images/character/eat3.png");
        this.remainingLife = 12;
        this.speed = 5;
        this.sprite.scale = 2;
        this.isEating = false;
        this.isMoving = false;



        this.boundaryX = 0; 
        this.boundaryY = 0;
        this.boundaryWidth = width; 
        this.boundaryHeight = height;

        // this.gravity = 0.5;      // The downward acceleration per frame
        // this.jumpForce = -10;    // The initial upward velocity when jumping (negative moves up)
        // this.onGround = false;   // State tracker
        
        // this.groundY = this.boundaryY + this.boundaryHeight;
    }

    update() {
        this.isMoving = false;
        
        // Reset the eating state at the start of the frame
        this.isEating = false; 
        
        // --- 1. Movement Logic ---
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // A or Left
            this.sprite.position.x -= this.speed;
            this.sprite.mirrorX(-1); // Flip sprite left
            this.isMoving = true;
            this.remainingLife -= 0.01;
        }
        // Use 'else if' for mutually exclusive directions (optional, but cleaner)
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // D or Right
            this.sprite.position.x += this.speed;
            this.sprite.mirrorX(1);
            this.isMoving = true;
            this.remainingLife -= 0.01;

        }
        if (keyIsDown(UP_ARROW) || keyIsDown(87)) { // W or Up
            this.sprite.position.y -= this.speed;
            this.isMoving = true;
            this.remainingLife -= 0.01;

        }
        if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) { // S or Down
            this.sprite.position.y += this.speed;
            this.isMoving = true;
            this.remainingLife -= 0.01;

        }

        // --- 2. Action Logic (Eating) ---
        if (keyIsDown(69)) { // E key
            this.isEating = true;
        }


        this.sprite.position.x = constrain(
            this.sprite.position.x, 
            this.boundaryX, 
            this.boundaryX + this.boundaryWidth
        );
        this.sprite.position.y = constrain(
            this.sprite.position.y, 
            this.boundaryY, 
            this.boundaryY + this.boundaryHeight
        );

        


        // --- 3. Animation Priority (The Fix) ---
        if (this.isMoving) {
            // Priority 1: Eating animation overrides all others
            this.sprite.changeAnimation("walk");
        } else if (this.isEating) {
            // Priority 2: Walking animation
            this.sprite.changeAnimation("eat");
        } else {
            // Default: Idle animation
            this.sprite.changeAnimation("idle");
        }
    }

    // The eat method is no longer needed, but if you want to keep it, 
    // it should only set a flag and return, not change the animation.
    // Example:
    // eat() {
    //    if (keyIsDown(69)) {
    //        this.isEating = true;
    //    }
    // }

    display() {
        drawSprites();
    }
}