ig.module(
  'game.entities.pressurePad'
).requires(
  'plugins.box2d.entity',
  'game.entities.actionBlock'
).defines(function(){
  EntityPressurePad = EntityActionBlock.extend({

	  init: function( x, y, settings ) {
      this.setChangeableSetting(settings, "width", 32);
      this.setChangeableSetting(settings, "height", 32);
      this.setChangeableSetting(settings, "color", "blue");
      this.setChangeableSetting(settings, "solveState", "true");
      this.setChangeableSetting(settings, "isNote", true);
      this.setChangeableSetting(settings, "instrument", "instrument");

	    this.parent(x, y, settings);

      if(ig.editor === undefined) {
        if(!ig.andro.isSetup(this)) {
          ig.andro.setup(this);
        }

        ig.andro.augment(this, TouchCount, {
          eligibleFn: function(obj) {
            return !ig.util.inInstances(obj, [EntitySword, EntityBullet, EntityParticle]);
          }
        });
        ig.andro.augment(this, AnimIfTouching, { touch: "on_full", noTouch: "low" });
        ig.andro.augment(this, ExportIsSolved);
      }
	  }
  });
});