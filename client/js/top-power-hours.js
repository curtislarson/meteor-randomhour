Template.topPowerHours.onRendered(function() {
  Adsense.addTopBarCode();
  document.title = "Top Power Hours - RandomPowerHour";
});

Template.topPowerHours.helpers({
  topPowerHours: function() {
    return PowerHours.find({}, {
      sort: {
        numPlayed: -1
      }
    });
  }
});