ig.module(
  'game.entities.checkpoint'
).requires(
  'plugins.box2d.entity',
  'game.entities.actionBlock'
).defines(function(){
  EntityCheckpoint = EntityActionBlock.extend({

	  init: function( x, y, settings ) {
      this.setChangeableSetting(settings, "width", 16);
      this.setChangeableSetting(settings, "height", 16);
      this.setChangeableSetting(settings, "color", "green");

	    this.parent(x, y, settings);

      if(ig.editor === undefined) {
        ig.andro.setup(this);
        this.setAnim(this.color + "arm");

        ig.andro.augment(this, TouchCount, {
          eligibleFn: function(obj) {
            return obj instanceof EntityPlayer;
          }
        });

        // light up and play note on first ever touch
        ig.andro.augment(this, {
          setup: function(owner, eventer) {
            var self = this;
            this.tagged = false;
            eventer.bind(this, "TouchCount:newlyTouching", function(data) {
              if(self.tagged === false) {
                eventer.emit("playing");
                owner.setAnim(owner.color + "on_full");
                ig.checkpointer.tag(data.otherEntity.pos);
                ig.checkpointer.clearEvents(); // remove events from prev checkpoint
                self.tagged = true;

                ig.sounder.play("g3Sound");
              }
            });
          }
        });
      }
	  }
  });
});
