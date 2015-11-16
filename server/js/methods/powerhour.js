Meteor.methods({
  createPowerHour: function(options, playlist) {
    check(options, AutoFormSchemas.Setup);
    console.log("createPowerHour", options, playlist);


    var playlistId = playlist.id.playlistId;
    var powerHourSlug = null;
    var powerHourId = null;
    var powerHour = PowerHours.findOne({playlistId: playlistId});
    if (powerHour) {
      powerHourSlug = powerHour.slug;
      powerHourId = powerHour._id;
    }
    else {
      var insertObject = {
        playlistId: playlistId,
        playlist: playlist,
        title: playlist.snippet.title
      };
      powerHourId = PowerHours.insert(insertObject);
      powerHourSlug = PowerHours.findOne({_id: powerHourId}).slug;
    }

    var metaObject = {
      powerHourId: powerHourId,
      searchTerm: options.playlistSearch,
      numSongs: options.numSongs,
      duration: options.duration
    };

    var metadataId = PowerHourMetadata.insert(metaObject);

    return {
      powerHourSlug: powerHourSlug,
      metadataId: metadataId
    };
  }
});