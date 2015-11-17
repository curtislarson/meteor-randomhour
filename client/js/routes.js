Router.route("/", {
  name: "index",
  layoutTemplate: "mainLayout",
  action: function() {
    this.render("index");
  }
});

Router.route("/play/:powerHourSlug", {
  name: "play",
  layoutTemplate: "mainLayout",
  waitOn: function() {
    return [
      Meteor.subscribe("powerhour", this.params.powerHourSlug),
      Meteor.subscribe("powerhourmetadata", this.params.query.meta)
    ];
  },
  action: function() {
    this.render("player");
  }
});

Router.route("/about", {
  name: "about",
  layoutTemplate: "mainLayout",
  action: function() {
    this.render("about");
  }
});

Router.route("/privacy", {
  name: "privacy",
  layoutTemplate: "mainLayout",
  action: function() {
    this.render("privacy");
  }
});