;(function() {
  this.SolveAllCorrect = {
    setup: function(owner, eventer) {
      eventer.bind(this, "owner:update", function() {
        for(var i = 0; i < owner.notes.length; i++) {
          if(!owner.notes[i].isSolved()) {
            return;
          }
        }

        eventer.emit("solved");
      });
    }
  };
}).call(this);