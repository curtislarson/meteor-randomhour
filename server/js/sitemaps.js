sitemaps.add("/sitemap.xml", function() {
  // Pull the top 1k items based on view count
  var powerHours = PowerHours.find({}, {
    sort: {
      numPlayed: -1
    },
    limit: 1000
  });

  var returnMap = [];
  powerHours.forEach(function(powerHour) {
    returnMap.push({
      page: "/play/" + powerHour.slug,
      lastmod: new Date()
    });
  });
  return returnMap;
});