Meteor.startup(function() {
  YoutubeApi.authenticate({
    type: "key",
    key: Meteor.settings.youtube_api_key
  });

  var path = Meteor.npmRequire("path");
  var phantomjs = Meteor.npmRequire("phantomjs");
  process.env.path += ":" + path.dirname(phantomjs.path);
});