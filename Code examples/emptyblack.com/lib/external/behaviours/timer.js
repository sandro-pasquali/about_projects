;(function() {
  this.Timer = {
    setup: function(owner, eventer, settings) {
      var self = this;
      eventer.bind(this, "timer:start", function() {
        self.createTimeout(eventer, settings);
      });

      eventer.bind(this, "timer:stop", function() {
        clearTimeout(this.timer);
      });
    },

    createTimeout: function(eventer, settings) {
      var self = this;
      this.timer = setTimeout(function() {
        eventer.emit("timer:elapsed");
        if(settings.repeat === true) {
          self.createTimeout(eventer, settings);
        }
      }, settings.time);
    }
  };
}).call(this);
