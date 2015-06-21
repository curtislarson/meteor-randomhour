// Global Variables
var player = null;
var timer = null;
var SONG_DURATION = 0;
var SONG_BUFFER = 2000; // 2 second buffer
var NUM_SONGS = 0;
var songCounter = 0;

// YouTube Player Events
var onPlayerReady = function(event) {
  console.log("Player ready!");
}

// TODO:
// Update setTimeout to use a more accurate timer like from below
// https://gist.github.com/tanepiper/4215634
var onPlayerStateChange = function(event) {
  var state = event.data;
  if (state == YT.PlayerState.PLAYING) {
    // Start up another video
    songCounter++;
    if (songCounter >= NUM_SONGS) {
      // We don't want to play any more songs.
      player.stopVideo();
      return;
    }
  }
  else if (state == YT.PlayerState.CUED) {
    console.log("Video cued");
    player.setShuffle(true);
    startTimer();
  }
}

onYouTubeIframeAPIReady = function () {
  player = new YT.Player("player", {
      height: "400", 
      width: "600", 
      events: {
        "onReady": onPlayerReady,
        "onStateChange": onPlayerStateChange
      }
  });
};


// Middleware functions
var startNextRandomVideo = function() {
  if (!player) {
    console.log("Cannot generate start time, player null");
    return;
  }

  // Duration of the current video
  var duration = player.getDuration();
  var maxStartTime = duration - (SONG_DURATION + SONG_BUFFER);
  var startTime = Math.floor(Math.random() * maxStartTime) + 10;
  console.log("duration = ", duration);
  console.log("startTime=", startTime);

  player.seekTo(startTime, true);
  player.playVideo();

}

var preparePlaylist = function(playlistId) {
  if (!player) {
    console.log("Player not initialized!");
    return;
  }

  player.cuePlaylist({
    list: playlistId,
    listType: "playlist",
    startSeconds: 1
  });
}

var nextVideo = function(timer) {
  console.log("nextVideo time=", new Date());
  player.nextVideo();
  player.pauseVideo();
  startNextRandomVideo();
}

var startTimer = function() {
  timer = HighResolutionTimer({
    duration: SONG_DURATION * 1000 + SONG_BUFFER,
    callback: nextVideo
  });

  timer.run();
}

// UI Methods
Template.index.onRendered(function() {
  console.log("Index rendered");
  YT.load();
});

Template.index.events({

  "submit .add-playlist": function(event) {
    var playlistId = event.target.playlistId.value;
    NUM_SONGS = event.target.numSongs.value;
    SONG_DURATION = event.target.songDuration.value;
    preparePlaylist(playlistId);
    return false;
  },

  "click .stopButton": function(event) {
    console.log("STOP!");
    timer.stop();
    player.stopVideo();
    return false;
  }

});