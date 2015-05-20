Meteor.startup(function() {
  Meteor.loginWithPassword("demo@demo.com", "demopassword", function(err) {
    if (Meteor.user()) {
      console.log("Demo account login successfull");
    }
    else {
      console.log("Error logging into demo account");
    }
  });
})