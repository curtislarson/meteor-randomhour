var Metadata = new ReactiveVar(null);
var PowerHour = new ReactiveVar(null);

var CurrentSong = new ReactiveVar(0);
var CurrentSongInfo = new ReactiveVar(null);
var SongIds = new ReactiveVar(null);
var IsPaused = new ReactiveVar(false);

var PlayerReady = new ReactiveVar(false);

var SONG_BUFFER = 10;

var timer = null;
var player = null;

onYouTubeIframeAPIReady = function() {
  player = new YT.Player("player", {
    events: {
      "onReady": onPlayerReady,
      "onStateChange": onPlayerStateChange,
      "onError": onError
    },
    playerVars: {
      controls: 0,
      iv_load_policy: 3,
      loop: 1
    }
  });
};

var onError = function(event) {
  console.log("ERROR!", event);
  nextVideo();
}

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
      console.log("CUED starting!");
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
  else {
    CurrentSong.set(songNumber);
  }
};

var populateVideoInformation = function(index) {
  console.log("index=", index);
  console.log(SongIds.get());
  var videoId = SongIds.get()[index];
  console.log("videoId=", videoId);
  Meteor.call("getVideoInfo", videoId, function(err, resp) {
    if (err) {
      Notifications.error("Error", "Error retrieving video information");
    }
    else {
      console.log("resp=", resp);
      CurrentSongInfo.set(resp);
    }
  });
};

var nextVideo = function(incrementCounter) {
  player.nextVideo();
  player.pauseVideo();

  // Fix for always playing the last song
  var playlistIndex = player.getPlaylistIndex();
  var playlistLength = SongIds.get().length;

  if (playlistIndex === (playlistLength - 1)) {
    var playlistLength = SongIds.get().length;
    var newIndex = Math.floor(Math.random() * playlistLength);
    player.playVideoAt(newIndex);
    player.pauseVideo();
    playlistIndex = newIndex;
  }

  var duration = player.getDuration();
  var metadata = Metadata.get();
  if (duration >= (metadata.duration + (SONG_BUFFER * 2))) {
    var maxStartTime = duration - (metadata.duration + SONG_BUFFER);
    var startTime = Math.floor(Math.random() * maxStartTime) + SONG_BUFFER;
    player.seekTo(startTime, true);
    console.log("playing");
    player.playVideo();
    console.log(player.getPlaylistIndex());
    if (incrementCounter) {
      incrementSongCount();
    }
  }
  else {
    // Next video, not long enough
    nextVideo(true);
  }

  populateVideoInformation(playlistIndex);
};

var startTimer = function() {
  var metadata = Metadata.get();
  console.log("start timer");
  timer = HighResolutionTimer({
    duration: (metadata.duration * 1000) + 2000,
    callback: function() {
      nextVideo(true);
    }
  });
  timer.run();
};

var startPowerHour = function() {
  console.log("shuffle");
  player.setShuffle(true);
  var songIds = player.getPlaylist();
  SongIds.set(songIds);
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
  Meteor.call("incrementPlayCount", powerHour._id);

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

Template.player.events({
  "click .pause-play-button": function() {
    console.log("pause-play-button");
    var paused = IsPaused.get();
    if (paused) {
      timer.unpause();
      player.playVideo();
    }
    else {
      timer.pause();
      player.pauseVideo();
    }
    IsPaused.set(!paused);
  },
  "click .btn-facebook": function() {
    var link = "https://www.facebook.com/sharer/sharer.php?u=" +
      encodeURIComponent(window.location);
    window.open(link, "", "height=440,width=640,scrollbars=yes");
  },
  "click .btn-twitter": function() {
    var link = "https://twitter.com/share?url=" +
      encodeURIComponent(window.location) + "&text=" +
      encodeURIComponent("Listening to an awesome #powerhour on RandomPowerHour.com!");
    window.open(link, "", "height=440,width=640,scrollbars=yes");
  }
});

Template.player.helpers({
  powerHour: function() {
    return PowerHours.findOne({});
  },
  isPaused: function() {
    return IsPaused.get();
  },
  currentSong: function() {
    return CurrentSong.get();
  },
  currentSongInfo: function() {
    return CurrentSongInfo.get();
  },
  totalSongNumber: function() {
    var metadata = Metadata.get();
    if (metadata) {
      return metadata.numSongs;
    }
  },
});