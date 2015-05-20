var player = null;
var timer = null;
var SONG_LENGTH = 60;

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

// zedd id = Sl2HeP8RlfU
// playlist = PLnq7V0ygBnUGuQBDor-tCGU4IG09Ygv9a


var onPlayerReady = function(event) {
  console.log("Player ready!");
  //event.target.playVideo();
  /*player.loadVideoById({
    "videoId": "Sl2HeP8RlfU",
    "startSeconds": 5
  });*/

  //event.target.playVideo();
}

var onPlayerStateChange = function(event) {
  var state = event.data;
  if (state == YT.PlayerState.PLAYING) {
    console.log("Video playing");
    // Start up another video
    timer = setTimeout(function() {
      player.nextVideo();
      player.pauseVideo();
      randomStart();
    }, SONG_LENGTH * 1000);
  }
  else if (state == YT.PlayerState.CUED) {
    console.log("Video cued");
    randomStart();
  }
}

// Setup the youtube player

onYouTubeIframeAPIReady = function () {

  // New Video Player, the first argument is the id of the div.
  // Make sure it's a global variable.
  player = new YT.Player("player", {

      height: "400", 
      width: "600", 

      // videoId is the "v" in URL (ex: http://www.youtube.com/watch?v=LdH1hSWGFGU, videoId = "LdH1hSWGFGU")
      //videoId: "Sl2HeP8RlfU", 

      // Events like ready, state change, 
      events: {
        "onReady": onPlayerReady,
        "onStateChange": onPlayerStateChange
      }
  });

};

var loadPlaylist = function(playlistId) {
  if (!player) {
    console.log("Player not initialized!");
    return;
  }

  player.cuePlaylist({
    list: playlistId,
    listType: "playlist",
    startSeconds: 1
  });
  player.setShuffle(true);
}


Template.index.onRendered(function() {
  console.log("Index rendered");

  YT.load();
});

Template.index.events({

  "submit .add-playlist": function(event) {
    var playlistId = event.target.playlistId.value;
    console.log("playlistId=", playlistId);
    loadPlaylist(playlistId);
    return false;
  },

  "click .stopButton": function(event) {
    console.log("STOP!");
    clearTimeout(timer);
    player.stopVideo();
    return false;
  }

});