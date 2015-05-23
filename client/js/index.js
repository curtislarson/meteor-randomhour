// Global Variables
var player = null;
var timer = null;
var SONG_DURATION = 0;
var NUM_SONGS = 0;
var songCounter = 0;

// YouTube Player Events
var onPlayerReady = function(event) {
  console.log("Player ready!");
}

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
    timer = setTimeout(function() {
      player.nextVideo();
      player.pauseVideo();
      randomStart();
    }, SONG_DURATION * 1000);
  }
  else if (state == YT.PlayerState.CUED) {
    console.log("Video cued");
    randomStart();
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
var randomStart = function() {
  if (!player) {
    console.log("Cannot generate start time, player null");
    return;
  }

  // Duration of the current video
  var duration = player.getDuration();
  console.log("duration = ", duration);
  var startTime = Math.floor(Math.random() * (duration - 1 + 1)) + 1;
  console.log("startTime=", startTime);
  player.seekTo(startTime, true);
  player.playVideo();

}

var loadPlaylist = function(playlistId, numSongs, songDuration) {
  if (!player) {
    console.log("Player not initialized!");
    return;
  }

  // Global variables are gross!
  NUM_SONGS = numSongs;
  SONG_DURATION = songDuration;

  player.cuePlaylist({
    list: playlistId,
    listType: "playlist",
    startSeconds: 1
  });
  player.setShuffle(true);
}

// UI Methods
Template.index.onRendered(function() {
  console.log("Index rendered");
  YT.load();
});

Template.index.events({

  "submit .add-playlist": function(event) {
    var playlistId = event.target.playlistId.value;
    var numSongs = event.target.numSongs.value;
    var songDuration = event.target.songDuration.value;
    loadPlaylist(playlistId, numSongs, songDuration);
    return false;
  },

  "click .stopButton": function(event) {
    console.log("STOP!");
    clearTimeout(timer);
    player.stopVideo();
    return false;
  }

});