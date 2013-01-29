ig.module(
  'game.entities.hint'
).requires(
  'impact.entity'
).defines(function(){

  EntityHint = ig.Entity.extend({
	  size: { x: 1, y: 8 },

    init: function(x, y, settings) {
      this.parent(x, y, settings);
      if(!ig.leveler)
        this.currentAnim = null;
    },
  });
});