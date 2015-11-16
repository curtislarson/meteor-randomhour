Schema = {};

Schema.PowerHour = new SimpleSchema({
  title: {
    type: String
  },
  playlistId: {
    type: String
  },
  playlist: {
    type: Object,
    blackbox: true
  },
  numPlayed: {
    type: Number,
    autoValue: function() {
      if (this.isInsert) {
        return 0;
      }
    }
  }
});

Schema.PowerHourMetadata = new SimpleSchema({
  powerHourId: {
    type: String
  },
  searchTerm: {
    type: String
  },
  numSongs: {
    type: Number
  },
  duration: {
    type: Number
  }
});

PowerHours = new Mongo.Collection("powerhours");
PowerHours.friendlySlugs("title");
PowerHourMetadata = new Mongo.Collection("powerhourmetadata");

PowerHours.attachSchema(Schema.PowerHour);
PowerHourMetadata.attachSchema(Schema.PowerHourMetadata);