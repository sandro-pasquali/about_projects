ig.module(
  'game.entities.instrument'
).requires(
  'impact.entity'
).defines(function(){

  EntityInstrument = ig.Entity.extend({
	  size: { x: 8, y: 8 },
    active: true,

    init: function(x, y, settings) {
      this.setChangeableSetting(settings, "name", "instrument");

      this.parent(x, y, settings);
      this.setupBehaviour(settings);
    },

    setup: function() {
      this.notes = [];
      var potentialNoteBlocks = ig.game.getEntitiesByType(EntityActionBlock);

      for(var i = 0; i < potentialNoteBlocks.length; i++) {
        if(potentialNoteBlocks[i].isNote === true &&
           potentialNoteBlocks[i].instrument === this.name) {
          this.notes.push(potentialNoteBlocks[i]);
        }
      }

      this.notes = this.notes.sort(function(a, b) {
        return a.pos.x - b.pos.x;
      });
    },

    activate: function() {
      this.active = true;
      ig.andro.eventer(this).emit("owner:active");
    },

    deactivate: function() {
      this.active = false;
      ig.andro.eventer(this).emit("owner:inactive");
    },

    inView: function() {
      for(var i = 0; i < this.notes.length; i++) {
        if(ig.mover.inView(this.notes[i])) {
          return true;
        }
      }

      return false;
    },

    update: function() {
      this.parent();
      if(this.active === true && this.inView()) {
        ig.andro.eventer(this).emit("owner:update");
      }
    }
  });
});