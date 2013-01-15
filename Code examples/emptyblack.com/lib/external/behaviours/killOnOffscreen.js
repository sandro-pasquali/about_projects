;(function() {
  this.KillOnOffscreen = {
    setup: function(owner, eventer) {
      eventer.bind(this, "owner:update", function() {
        if(!owner.isInView()) {
          owner.reapReady();
        }
      });
    }
  };
}).call(this);