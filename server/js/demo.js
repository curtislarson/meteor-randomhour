Demo = {};

Demo.generateDemo = function() {
  var demo = Meteor.users.findOne({username: "demo"});
  if (undefined === demo || null === demo) {
    console.log("Generating demo account");
    var userId = Accounts.createUser({
      username: "demo",
      email : "demo@demo.com",
      password: "demopassword"
    });
  }
}

Meteor.methods({

  generateDemo: function() {
    Demo.generateDemo();
    console.log("Demo Generated")
  }

});