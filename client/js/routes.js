Router.route("/", {
  name: "index",
  layoutTemplate: "mainLayout",
  action: function() {
    this.render("index");
  }
});

Router.route("/about", {
  name: "about",
  layoutTemplate: "mainLayout",
  action: function() {
    this.render("about");
  }
});

Router.route("/classic", {
  name: "classic",
  layoutTemplate: "mainLayout",
  action: function() {
    this.render("classic");
  }
});

Router.route("/power-hour", {
  name: "powerHour",
  layoutTemplate: "mainLayout",
  action: function() {
    this.render("powerHour");
  }
});