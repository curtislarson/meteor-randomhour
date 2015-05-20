Playlists = new Mongo.Collection("playlists");
Videos = new Mongo.Collection("videos");


Meteor.publish("playlists", function() {
  return Playlists.find({
    owner: this.userId
  })
});

Meteor.publish("videos", function(playlist) {
  return Videos.find({
    owner: this.userId,
    playlist: playlist
  });
});