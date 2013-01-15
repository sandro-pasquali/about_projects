;(function() {
  this.Loop = {
    loopTimeout: null,

    setup: function(owner, eventer) {
      this.owner = owner;
      this.eventer = eventer;
      eventer.bind(this, "Loop:start", function() {
        this.loop();
      });

      eventer.bind(this, "Loop:stop", function() {
        eventer.emit("stop");
        clearTimeout(this.loopTimeout);
      });
    },

    loop: function() {
      var self = this;
      this.eventer.emit("playing");
      this.loopTimeout = setTimeout(function() {
        self.loop();
      }, this.owner.time * 1000);
    }
  };
}).call(this);