Router.route("/", {
  name: "index",

  action: function() {
    this.render("index");
  }
});

Router.route("/demo", {
  name: "demo",

  action: function() {
    Meteor.call("generateDemo", function(err, or) {
      Router.go("index");
    })
  }
})