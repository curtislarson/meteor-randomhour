Router.route("/", {
  name: "index",
  layoutTemplate: "mainLayout",
  action: function() {
    this.render("index");
  }
});

Router.route("/login", {
  name: "login",
  layoutTemplate: "mainLayout",
  action: function() {
    this.render("login");
  }
});

Router.route("/register", {
  name: "register",
  layoutTemplate: "mainLayout",
  action: function() {
    this.render("register");
  }
});

Router.route("/about", {
  name: "about",
  layoutTemplate: "mainLayout",
  action: function() {
    this.render("about");
  }
});