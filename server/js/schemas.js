var Schema = {};

Schema.Playlist = new SimpleSchema({
  name: {
    type: String,
    label: "Name"
  },
  owner: {
    type: String
  }
});

Schema.Video = new SimpleSchema({
  url: {
    type: String,
    label: "URL"
  },
  playlist: {
    type: String,
    label: "Playlist"
  },
  owner: {
    type: String
  }
});

Playlists.attachSchema(Schema.Playlist);
Videos.attachSchema(Schema.Video);