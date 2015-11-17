var YouTubeSearch = null;

var SelectedPlaylist = new ReactiveVar(null);

Template.setup.onCreated(function() {
  var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
  };
  var fields = ["title"];
  YouTubeSearch = new SearchSource("youtube", fields, options);

  SelectedPlaylist.set(null);
});

Template.setup.events({
  "keyup #playlistSearch": _.throttle(function(event) {
    var val = $(event.currentTarget).val();
    if (val !== "") {
      YouTubeSearch.search(val);
    }
  }, 100),

  "keyup #setupForm": function() {
    event.stopPropagation();
  },

  "click .playlist-item": function() {
    SelectedPlaylist.set(this);
  }
});

Template.setup.helpers({
  setupSchema: function() {
    return AutoFormSchemas.Setup;
  },
  searchResults: function() {
    var data = YouTubeSearch.getData();
    return data;
  },
  selectedPlaylist: function() {
    return SelectedPlaylist.get();
  },
  isSelected: function(playlist) {
    var selectedPlaylist = SelectedPlaylist.get();
    console.log("selected=", selectedPlaylist);
    console.log("playlist=", playlist._id);
    if (selectedPlaylist) {
      return playlist._id === selectedPlaylist._id;
    }
    else {
      return false;
    }
  }
});

Template.playerOptions.onRendered(function() {
  $("html, body").animate({
    scrollTop: $("#playerOptions").offset().top
  }, "slow");
});

AutoForm.addHooks("setupForm", {
  onSubmit: function(insertDoc, updateDoc, currentDoc) {
    check(insertDoc, AutoFormSchemas.Setup);

    var that = this;

    var selectedPlaylist = SelectedPlaylist.get();
    if (!selectedPlaylist) {
      Notifications.error("Please select a playlist!");
      GAnalytics.event("setup", "noPlaylist");
      return false;
    }
    GAnalytics.event("setup", "powerHourCreated");
    Meteor.call("createPowerHour",
                insertDoc,
                selectedPlaylist,
                function(err, id) {
      if (err) {
        that.done(err);
      }
      else {
        that.done(undefined, id);
      }
    });
    return false;
  },

  onSuccess: function(formType, result) {
    Router.go("/play/" + result.powerHourSlug + "?meta=" + result.metadataId);
  },

  onError: function(formType, error) {
    console.log("onError", formType, error);
    switch(formType) {
      case "pre-submit validation":
        // This is handled by our error messages by the fields
        break;
      default:
        if (error.reason) {
          Notifications.error("Error!",
                              "Error creating power hour" + error.reason);
        }
        else {
          Notifications.error("Error!", "Error creating power hour");
        }
        break;
    }
  }
});