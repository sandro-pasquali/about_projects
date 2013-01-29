ig.module(
  'game.entities.turretBlock'
).requires(
  'plugins.box2d.entity',
  'game.entities.actionBlock'
).defines(function(){
  EntityTurretBlock = EntityActionBlock.extend({
	  init: function(x, y, settings) {
      settings.density = 3;
      this.setChangeableSetting(settings, "color", "blue");
      this.setChangeableSetting(settings, "restitution", 0.1);
	    this.parent(x, y, settings);
	  },

    setup: function(level) {
      if(ig.editor === undefined) {
        this.nervous = new Nervous(this);
        this.nervous.eyes = new Nervous.Eyes(this.nervous, level.solidityMap);

        ig.andro.setup(this);

        ig.andro.augment(this, Passer, { from: "owner:kill", to: "benignExploder:go" });
        ig.andro.augment(this, BenignExploder, {
          count: 10, size: 2, color: this.color, force: 7
        });

        // emit shoot orders for closest visible enemy
        this.setAnim(this.color + "on_full");

        ig.andro.augment(this, Targeter, { level: level });

        // throb when got target
        ig.andro.augment(this, {
          throbTimeout: undefined,
          setup: function(owner, eventer) {
            eventer.bind(this, "owner:update", function() {
              if(owner.gotTarget()
                 && owner.target.isAlive()) {
                owner.setAnim(owner.color + "throb");

                clearTimeout(this.throbTimeout);
                this.throbTimeout = setTimeout(function() {
                  owner.setAnim(owner.color + "on_full");
                }, 1000);
              }
            });
          }
        });

        // shoot at thing
        ig.andro.augment(this, {
          lastShot: 0,
          setup: function(owner, eventer) {
            eventer.bind(this, "owner:update", function() {
              if(owner.gotTarget()
                 && owner.target.isAlive()
                 && ig.maths.timePassed(this.lastShot, 1000)) {
                var v = ig.maths.normalise(ig.maths.vectorTo(owner.pos, owner.target.pos));
                ig.game.spawnEntity(EntityBullet,
                                    (owner.pos.x + (owner.size.x / 2)) + (v.x * owner.size.x),
                                    (owner.pos.y + (owner.size.y / 2)) + (v.y * owner.size.x), {
                                      vector: v, owner: owner
                                    });

                owner.setAnim(owner.color + "throb");

                ig.sounder.play("gunshotSound");
                ig.amp.sound("shooting", owner);
                this.lastShot = new Date().getTime();
              }
            });
          }
        });
      }
    },

    canSee: function(obj) {
      return this.nervous.eyes.lookAt(obj).visible(); // view not blocked
    },

    getEnemies: function() {
      var enemies = ig.util.addAll([], ig.game.getEntitiesByType(EntityEnemy));
      return ig.util.addAll(enemies, ig.game.getEntitiesByType(EntitySentry));
    }
  });
});
