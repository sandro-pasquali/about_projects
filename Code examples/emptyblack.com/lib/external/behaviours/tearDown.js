;(function() {
  this.TearDown = {
    setup: function(owner, eventer, settings) {
      return {
        tearDown: function() {
          ig.andro.tearDown(owner);
        }
      };
    },
  };
}).call(this);