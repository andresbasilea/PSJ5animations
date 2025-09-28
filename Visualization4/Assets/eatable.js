class Eatable {
    constructor(x, y) {
        this.sprite = createSprite(x, y);

        this.sprite.addAnimation("devour", 
            "assets/images/items/apple1.png",
            "assets/images/items/apple2.png",
            "assets/images/items/apple3.png",
            "assets/images/items/apple4.png",
        );
        
        this.sprite.animation.frameDelay = 10; // Adjust for speed (smaller number = faster)
        this.sprite.visible = true;
        this.sprite.animation.looping = false; // The eating animation should only play once
        this.sprite.scale = 2;

        this.isBeingEaten = false; // Add a state flag
        
        // Start the animation paused and on the last frame (invisible)
        this.sprite.animation.stop();
        //this.sprite.animation.goToFrame(this.sprite.animation.getLastFrame()); 

    }
    
    // This function will be called by the Character when it overlaps/eats the object.
    startEatingAnimation() {
        if (!this.isBeingEaten) {
            // Start the non-looping animation from the beginning
            // this.sprite.changeAnimation("devour");
            // this.sprite.animation.changeFrame(0);
            // this.sprite.animation.play();
            // this.sprite.animation.isOver = true;
            this.isBeingEaten = true;
            
            this.sprite.changeAnimation("devour");
            this.sprite.animation.changeFrame(0);
            this.sprite.animation.play();
        }
    }

    // New combined update/action method
    update() {
        if (this.isBeingEaten) {
            // Check if the non-looping animation has finished playing
            if (this.sprite.animation.isOver) {
                this.sprite.remove(); // Only remove after the animation is finished
            }
        }
    }

    display() {
        drawSprites();
    }
}