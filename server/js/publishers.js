Meteor.publish("powerhour", function(slug) {
  if (!slug) {
    return [];
  }

  return PowerHours.find({slug: slug});
});

Meteor.publish("powerhourmetadata", function(id) {
  if (!id) {
    return [];
  }

  return PowerHourMetadata.find({_id: id});
});