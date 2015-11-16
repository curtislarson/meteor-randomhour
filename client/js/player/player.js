var Metadata = new ReactiveVar(null);

Template.player.onRendered(function() {
  var metadata = PowerHourMetadata.findOne({});
  if (!metadata) {
    metadata = {
      numSongs: 60,
      duration: 60
    }
  }

  Metadata.set(metadata);
});