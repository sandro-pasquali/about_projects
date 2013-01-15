ig.module(
  'game.entities.crate'
).requires(
  'plugins.box2d.entity',
  'game.entities.block'
).defines(function(){
  EntityCrate = EntityBlock.extend({
	  init: function( x, y, settings ) {
      this.setChangeableSetting(settings, "density", 3);
      this.setChangeableSetting(settings, "restitution", 0.1);
      this.setChangeableSetting(settings, "width", 8);
      this.setChangeableSetting(settings, "height", 8);

      settings.behaviour1 = "TouchCount";
      settings.behaviour2 = "DamageOnTouch";

      this.parent(x, y, settings);

      this.setupBehaviour(settings);
	  },

    addAnims: function() {
      this.animSheet = new ig.AnimationSheet('media/crate'
                                             + this.size.x + 'x' + this.size.y + '.png',
                                             this.size.x, this.size.y);

	    this.addAnim('idle', 1, [0]);
    },
  });
});