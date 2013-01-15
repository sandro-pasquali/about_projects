;(function() {
  this.ActivateInstrumentWhileTouching = {
    setup: function(owner, eventer) {
      this.owner = owner;
      eventer.bind(this, "TouchCount:newlyTouching", this.activateInstrument);
      eventer.bind(this, "TouchCount:newlyNotTouching", this.deactivateInstrument);
    },

    activateInstrument: function() {
      this.eachInstrument(function(instrument) {
        instrument.activate();
      });
    },

    deactivateInstrument: function() {
      this.eachInstrument(function(instrument) {
        instrument.deactivate();
      });
    },

    eachInstrument: function(fn) {
      var instruments = ig.game.getEntitiesByType(EntityInstrument);
      for(var i = 0; i < instruments.length; i++) {
        if(instruments[i].name === this.owner.instrument) {
          fn(instruments[i]);
        }
      }
    }
  };
}).call(this);