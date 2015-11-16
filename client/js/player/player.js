var Metadata = new ReactiveVar(null);
var PowerHour = new ReactiveVar(null);
var CurrentSong = new ReactiveVar(0);
var PlayerReady = new ReactiveVar(false);

var SONG_BUFFER = 10;

var timer = null;
var player = null;

onYouTubeIframeAPIReady = function() {
  player = new YT.Player("player", {
    events: {
      "onReady": onPlayerReady,
      "onStateChange": onPlayerStateChange
    }
  });
};

var onPlayerReady = function() {
  PlayerReady.set(true);
};

var onPlayerStateChange = function(event) {
  var state = event.data;
  switch (state) {
    case YT.PlayerState.PLAYING:
      console.log("PLAYING!");
      break;
    case YT.PlayerState.CUED:
      startPowerHour();
      break;
    default:
      console.log("onPlayerStateChange", event);
  };
};

var incrementSongCount = function() {
  var songNumber = CurrentSong.get();
  var metadata = Metadata.get();
  songNumber++;
  if (songNumber > metadata.numSongs) {
    player.stopVideo();
    timer.stop();
  }
};

var nextVideo = function() {
  player.nextVideo();
  player.pauseVideo();

  var duration = player.getDuration();
  var metadata = Metadata.get();
  var maxStartTime = duration;
  if (duration > (metadata.duration + (SONG_BUFFER * 2))) {
    maxStartTime = duration - (metadata.duration + SONG_BUFFER);
    var startTime = Math.floor(Math.random() * maxStartTime) + SONG_BUFFER;
    player.seekTo(startTime, true);
    player.playVideo();
    incrementSongCount();
  }
  else {
    // Next video, not long enough
    nextVideo();
  }
};

var startTimer = function() {
  var metadata = Metadata.get();
  timer = HighResolutionTimer({
    duration: (metadata.duration * 1000) + 2000,
    callback: nextVideo
  });
  timer.run();
};

var startPowerHour = function() {
  player.setShuffle(true);
  startTimer();
};

Template.player.onRendered(function() {
  var metadata = PowerHourMetadata.findOne({});
  if (!metadata) {
    metadata = {
      numSongs: 60,
      duration: 60
    };
  }

  Metadata.set(metadata);

  var powerHour = PowerHours.findOne({});
  PowerHour.set(powerHour);

  YT.load();
  YTConfig.host = "http://www.youtube.com";

  this.autorun(function() {
    var ready = PlayerReady.get();
    if (ready) {
      player.cuePlaylist({
        list: powerHour.playlistId,
        listType: "playlist",
        startSeconds: 1
      });
    }
  });
});

