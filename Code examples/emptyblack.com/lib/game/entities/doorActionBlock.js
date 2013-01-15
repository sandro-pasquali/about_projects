ig.module(
  'game.entities.doorActionBlock'
).requires(
  'plugins.box2d.entity',
  'game.entities.actionBlock'
).defines(function(){
  EntityDoorActionBlock = EntityActionBlock.extend({

	  init: function( x, y, settings ) {
      this.setChangeableSetting(settings, "width", 16);
      this.setChangeableSetting(settings, "height", 16);
      this.setChangeableSetting(settings, "color", "blue");
      this.setChangeableSetting(settings, "instrument", "name");

	    this.parent(x, y, settings);

      if(ig.editor === undefined) {
        ig.andro.setup(this);
        this.setAnim(this.color + "on_full");

        // explode on kill
        ig.andro.augment(this, Passer, { from: "owner:kill", to: "benignExploder:go" });
        ig.andro.augment(this, BenignExploder, {
          count: 7, size: 3, color: this.color, force: 2
        });

        ig.andro.augment(this, KillOnDamage, {
          instances: [EntityParticle]
        });

        ig.andro.augment(this, OpenSesame, { type: EntityDoorActionBlock });
      }
	  }
  });
});
