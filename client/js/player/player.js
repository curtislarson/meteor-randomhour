var Metadata = new ReactiveVar(null);
var PowerHour = new ReactiveVar(null);

var CurrentSong = new ReactiveVar(0);
var CurrentSongInfo = new ReactiveVar(null);
var SongIds = new ReactiveVar(null);

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
  console.log("ERROR!", event)
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
  var videoId = SongIds.get()[index];
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

var nextVideo = function() {
  var playlistIndex = player.getPlaylistIndex();
  player.nextVideo();
  player.pauseVideo();

  // Fix for always playing the last song
  var playlistIndex2 = player.getPlaylistIndex();
  if (playlistIndex === playlistIndex2) {
    var playlistLength = SongIds.get().length;
    var newIndex = Math.floor(Math.random() * playlistLength);
    player.playVideoAt(newIndex);
    player.pauseVideo();
    playlistIndex2 = newIndex;
  }

  var duration = player.getDuration();
  var metadata = Metadata.get();
  if (duration >= (metadata.duration + (SONG_BUFFER * 2))) {
    var maxStartTime = duration - (metadata.duration + SONG_BUFFER);
    var startTime = Math.floor(Math.random() * maxStartTime) + SONG_BUFFER;
    player.seekTo(startTime, true);
    player.playVideo();
    incrementSongCount();
  }
  else {
    // Next video, not long enough
    nextVideo();
  }

  populateVideoInformation(playlistIndex2);
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

Template.player.helpers({
  powerHour: function() {
    return PowerHours.findOne({});
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
  }
});