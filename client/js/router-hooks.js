var IR_OnBeforeActionHooks = {
  addPageComponents: function() {
    var name = this.route.getName();
    this.render("mainHeader", {to: "header"});
    this.next();
  }
};

Router.onBeforeAction(IR_OnBeforeActionHooks.addPageComponents);