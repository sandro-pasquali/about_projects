ig.module(
  'game.entities.levelTransitionActionBlock'
).requires(
  'plugins.box2d.entity',
  'game.entities.actionBlock'
).defines(function(){
  EntityLevelTransitionActionBlock = EntityActionBlock.extend({

	  init: function( x, y, settings ) {
      this.setChangeableSetting(settings, "width", 32);
      this.setChangeableSetting(settings, "height", 32);
      this.setChangeableSetting(settings, "color", "yellow");

	    this.parent(x, y, settings);

      if(ig.editor === undefined) {
        ig.andro.setup(this);
        this.setAnim(this.color + "throb");

        ig.andro.augment(this, TouchCount, {
          eligibleFn: function(obj) {
            return obj instanceof EntityHuman;
          }
        });

        // next level
        ig.andro.augment(this, {
          setup: function(owner, eventer) {
            eventer.bind(this, "TouchCount:newlyTouching", function(obj) {
              if(obj.otherEntity instanceof EntityPlayer) {
                if(owner.levelName !== undefined) {
                  ig.leveler = Leveler.loadNewLevel(owner.levelName, true);
                }
                else {
                  var nextLevelName = ig.leveler.getNextLevelName();
                  if(nextLevelName !== null) {
                    ig.leveler = Leveler.loadNewLevel(nextLevelName, true);
                  }
                  else {
                    console.log("No next level.")
                  }
                }
              }
            });
          }
        });
      }
	  }
  });
});
