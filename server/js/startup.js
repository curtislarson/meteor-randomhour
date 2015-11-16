Meteor.startup(function() {
  YoutubeApi.authenticate({
    type: "key",
    key: Meteor.settings.youtube_api_key
  });
});