Meteor.publish("powerhour", function(slug) {
  if (!slug) {
    return [];
  }

  return PowerHours.find({slug: slug});
});

Meteor.publish("topPowerHours", function() {
  return PowerHours.find({}, {
    sort: {
      numPlayed: -1
    },
    limit: 12
  });
});

Meteor.publish("powerhourmetadata", function(id) {
  if (!id) {
    return [];
  }

  return PowerHourMetadata.find({_id: id});
});