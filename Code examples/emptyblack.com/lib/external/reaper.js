;(function() {
  function Reaper() {
    this.reapees = [];
  };

  Reaper.prototype = {
    update: function() {
      this.reap();
    },

    reap: function() {
      while(this.reapees.length > 0) {
        var obj = this.reapees.pop();
        obj.kill();
      }
    },

    add: function(reapee) {
      var added = false;
      if(reapee._reapQueued !== true) {
        this.reapees.push(reapee);
        reapee._reapQueued = true;
        added = true;
      }

      return added;
    }
  };

  this.Reaper = Reaper;
}).call(this);