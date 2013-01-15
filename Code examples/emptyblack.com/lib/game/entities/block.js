ig.module(
  'game.entities.block'
).requires(
  'plugins.box2d.entity'
).defines(function(){
  EntityBlock = ig.Box2DEntity.extend({

    material: function() { return ig.collider.materials.MOVEABLE_BLOCK; },

	  init: function( x, y, settings ) {
      this.setupSize(settings);
	    this.parent(x, y, settings);

      this.addAnims();
	  },

    setupSize: function(settings) {
      if(settings.width !== undefined && settings.height !== undefined) {
        this.size = { x: settings.width, y: settings.height };
      }
      else {
	      this.size = { x: 8, y: 8 };
      }
    },

    skewered: function() {
      ig.contactResolver.resolveFor(this);
    },

    addAnims: function() {}
  });
});