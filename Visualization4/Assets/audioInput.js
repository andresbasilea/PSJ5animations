let sample;

class SoundInput{
  constructor(soundPath) {
  this.sample = loadSound(soundPath);
}

playSound() {
    if (!this.sample.isPlaying()) {
        this.sample.play();
    }
    else{
      this.sample.stop();
    }
}

}


