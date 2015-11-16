AutoFormSchemas = {};

AutoFormSchemas.Setup = new SimpleSchema({
  playlistSearch: {
    type: String,
    autoform: {
      label: false,
      placeholder: "Playlist Search Term (e.g 'Top Music Videos')"
    }
  },
  numSongs: {
    type: Number,
    autoform: {
      label: false,
      defaultValue: 60
    }
  },
  duration: {
    type: Number,
    autoform: {
      label: false,
      defaultValue: 60
    }
  }
});