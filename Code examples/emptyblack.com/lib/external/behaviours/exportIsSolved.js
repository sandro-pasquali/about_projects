;(function() {
  this.ExportIsSolved = {
    touching: null,

    setup: function(owner, eventer) {
      this.owner = owner;
      var self = this;
      eventer.bind(this, "TouchCount:newlyTouching", function(data) {
        this.touching = data.otherEntity;
      });

      eventer.bind(this, "TouchCount:newlyNotTouching", function() {
        this.touching = null;
      });

      return {
        isSolved: function() {
          return owner.solveState === (self.touching !== null).toString()
        }
      };
    }
  };
}).call(this);