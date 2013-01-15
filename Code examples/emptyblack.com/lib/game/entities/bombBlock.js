ig.module(
  'game.entities.bombBlock'
).requires(
  'plugins.box2d.entity',
  'game.entities.actionBlock'
).defines(function(){
  EntityBombBlock = EntityActionBlock.extend({
	  init: function(x, y, settings) {
      settings.density = 3;
      settings.restitution = 0.1;

      this.setChangeableSetting(settings, "color", "red");
	    this.parent(x, y, settings);

      if(ig.editor === undefined) {
        ig.andro.setup(this);
        ig.andro.augment(this, Timer, { time: 3000 });
        ig.andro.augment(this, KillOnDamage, {
          instances: [EntityParticle, EntityBullet, EntityRocket]
        });

        // start timer on arm, kill on timer elapse
        this.setAnim(this.color + "on_full");
        ig.andro.augment(this, {
          armed: false,
          setup: function(owner, eventer) {
            eventer.bind(this, "arm", function() {
              if(!this.armed) {
                eventer.emit("timer:start");
                owner.setAnim(owner.color + "throb");
                this.armed = true;
              }
            });

            eventer.bind(this, "timer:elapsed", function() {
              owner.reapReady();
            });

            eventer.bind(this, "owner:kill", function() {
              eventer.emit("timer:stop");
            });
          }
        });

        // arm on unskewer
        ig.andro.augment(this, {
          setup: function(owner, eventer) {
            return {
              unskewer: function() {
                eventer.emit("arm");
              }
            }
          }
        });

        // explode on kill
        var absorbedBy = [EntityHuman, EntityDoorActionBlock, EntitySentry, EntityBombBlock];
        ig.andro.augment(this, DangerousExploder, {
          count: 10, size: 2, color: "white", force: 10, absorbedBy: absorbedBy
        });

        ig.andro.augment(this, {
          setup: function(owner, eventer) {
            eventer.bind(this, "owner:kill", function() {
              if(owner.isInView()) {
                ig.contactResolver.resolveFor(owner);
                eventer.emit("dangerousExploder:go");
                owner.reapReady();
              }
            });
          }
        });
      }
	  }
  });
});
