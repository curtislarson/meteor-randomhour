Meteor.methods({
  getVideoInfo: function(id) {
    check(id, String);
    var async = Meteor.wrapAsync(YouTube.getVideoInfo);
    var resp = async(id);
    if (resp.items) {
      return resp.items[0];
    }
  }
});