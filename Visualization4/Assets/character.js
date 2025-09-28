class Character {
    constructor(x, y) {
        this.sprite = createSprite(x, y);
        this.sprite.addAnimation("idle", "assets/images/character/idle.png");
        this.sprite.addAnimation("walk", "assets/images/character/walk1.png", "assets/images/character/walk2.png", "assets/images/character/walk3.png");
        this.sprite.addAnimation("eat", "assets/images/character/eat1.png", "assets/images/character/eat2.png", "assets/images/character/eat3.png");
        this.speed = 5;
        this.sprite.scale = 2;
        this.isEating = false;
        this.isMoving = false;



        this.boundaryX = 0; 
        this.boundaryY = 0;
        this.boundaryWidth = width; 
        this.boundaryHeight = height;

        this.gravity = 0.5;      // The downward acceleration per frame
        this.jumpForce = -10;    // The initial upward velocity when jumping (negative moves up)
        this.onGround = false;   // State tracker
        
        this.groundY = this.boundaryY + this.boundaryHeight;
    }

    // New combined update/action method
    update() {
        this.isMoving = false;
        
        // Reset the eating state at the start of the frame
        this.isEating = false; 
        
        // --- 1. Movement Logic ---
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // A or Left
            this.sprite.position.x -= this.speed;
            this.sprite.mirrorX(-1); // Flip sprite left
            this.isMoving = true;
        }
        // Use 'else if' for mutually exclusive directions (optional, but cleaner)
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // D or Right
            this.sprite.position.x += this.speed;
            this.sprite.mirrorX(1);
            this.isMoving = true;
        }
        if (keyIsDown(UP_ARROW) || keyIsDown(87)) { // W or Up
            this.sprite.position.y -= this.speed;
            this.isMoving = true;
        }
        if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) { // S or Down
            this.sprite.position.y += this.speed;
            this.isMoving = true;
        }

        // --- 2. Action Logic (Eating) ---
        if (keyIsDown(69)) { // E key
            this.isEating = true;
            // Note: Movement position change still happens even while eating!
        }


        // this.sprite.position.x = constrain(
        //     this.sprite.position.x, 
        //     this.boundaryX, 
        //     this.boundaryX + this.boundaryWidth
        // );
        // this.sprite.position.y = constrain(
        //     this.sprite.position.y, 
        //     this.boundaryY, 
        //     this.boundaryY + this.boundaryHeight
        // );

        this.sprite.velocity.y += this.gravity;
        
        // B. Handle Jump Input: If SPACE is pressed AND the character is on the ground
        if (keyIsDown(32) && this.onGround) { // 32 is the keyCode for SPACE
            this.sprite.velocity.y = this.jumpForce; // Apply upward velocity
            this.onGround = false; // Character is now airborne
        }
        
        // C. Apply Ground Constraint (This is your "floor")
        // Check if the character has hit or gone below the defined ground
        if (this.sprite.position.y >= this.groundY) {
            this.sprite.position.y = this.groundY; // Snap position to the ground line
            this.sprite.velocity.y = 0;              // Stop falling velocity
            this.onGround = true;                    // Character is back on the ground
        }
        
        // D. Boundary Constraint (Constrain X-position)
        // Keep the existing X-axis constraint here
        this.sprite.position.x = constrain(
            this.sprite.position.x, 
            this.boundaryX, 
            this.boundaryX + this.boundaryWidth
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