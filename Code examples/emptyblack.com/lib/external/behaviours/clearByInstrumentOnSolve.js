;(function() {
  this.ClearByInstrumentOnSolve = {
    setup: function(owner, eventer) {
      eventer.bind(this, "solved", function() {
        var entities = ig.game.getEntitiesByType(EntityDoorActionBlock);
        for(var i = 0; i < entities.length; i++) {
          if(entities[i]["instrument"] === owner.name) {
            entities[i].reapReady();
          }
        }
      });
    }
  };
}).call(this);