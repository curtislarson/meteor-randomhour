SearchSource.defineSource("youtube", function(searchText, options) {
  var asyncSearch = Meteor.wrapAsync(YouTube.searchPlaylist);
  try {
    var data = asyncSearch(searchText);
    if (data.items) {
      return data.items.map(function(item) {
        item._id = Random.id();
        return item;
      });
    }
    else {
      throw new Meteor.Error("YouTube Error", "No items found");
    }
  }
  catch(err) {
    console.log(err.stack);
    throw new Meteor.Error("YouTube Error", err.reason || err);
  }
});