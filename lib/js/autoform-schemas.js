AutoFormSchemas = {};

AutoFormSchemas.Player = new SimpleSchema({
  playlistSearch: {
    type: String,
    autoform: {
      label: false,
      placeholder: "Search for Playlist (e.g 'Top Music Videos', 'PL15B1E77BB5708555')"
    }
  }
});