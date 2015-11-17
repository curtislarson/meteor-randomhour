YouTube = {};

YouTube.searchPlaylist = function(searchText, callback) {
  YoutubeApi.search.list({
    part: "snippet",
    type: "playlist",
    maxResults: 6,
    q: searchText,
  }, function(err, data) {
    callback(err, data);
  });
};

YouTube.getVideoInfo = function(id, callback) {
  YoutubeApi.videos.list({
    part: "snippet",
    id: id
  }, function(err, data) {
    callback(err, data);
  });
};