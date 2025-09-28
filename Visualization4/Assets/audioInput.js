let sample;

function preloadSound() {
  sample = loadSound('music/Mahler_Symphony_No.4_in_G_major_1._Badachtig_Nicht_ellen_(Mahler)_European_Archive.ogg');
}

function playMusic() {
    if (!sample.isPlaying()) {
        sample.play();
    }
    else{
      sample.stop();
    }
}

