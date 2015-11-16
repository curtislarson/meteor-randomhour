var YouTubeSearch = null;

var SelectedPlaylist = new ReactiveVar(null);

Template.player.onCreated(function() {
  var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
  };
  var fields = ["title"];
  YouTubeSearch = new SearchSource("youtube", fields, options);
});

Template.player.events({
  "keyup #playlistSearch": _.throttle(function(event) {
    var val = $(event.currentTarget).val();
    if (val !== "") {
      YouTubeSearch.search(val);
    }
  }, 200),

  "click .playlist-item": function() {
    SelectedPlaylist.set(this);
    Meteor.setTimeout(function() {
      $("html, body").animate({
        scrollTop: $("#mainPlayer").offset().top
      }, "slow");
    }, 200);
  }
});

Template.player.helpers({
  playerSchema: function() {
    return AutoFormSchemas.Player;
  },
  searchResults: function() {
    var data = YouTubeSearch.getData();
    console.log(data);
    return data;
  },
  selectedPlaylist: function() {
    return SelectedPlaylist.get();
  }
});