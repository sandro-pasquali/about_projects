ig.module(
  'game.entities.sentry'
).requires(
  'plugins.box2d.entity',
  'game.entities.actionBlock'
).defines(function(){
  EntitySentry = EntityActionBlock.extend({
	  offset: { x: 13, y: 13 },

	  init: function(x, y, settings) {
      this.setChangeableSetting(settings, "width", 13);
      this.setChangeableSetting(settings, "height", 13);
      this.setChangeableSetting(settings, "startAngle", 180);
      this.setChangeableSetting(settings, "turnSpeed", 1);
      this.setChangeableSetting(settings, "shotDelay", 300);
      this.setChangeableSetting(settings, "ammoType", "EntityBullet");

      ig.andro.setup(this);
      ig.andro.augment(this, Health, { maxHealth: 8 });

	    this.parent(x, y, settings);
	  },

    setup: function(level) {
      // set starting angle
      var pos = new b2.Vec2((this.pos.x + (this.size.x / 2)) * b2.SCALE,
                            (this.pos.y + (this.size.y / 2)) * b2.SCALE);
      this.body.SetXForm(pos, ig.maths.degToRad(this.startAngle));

      this.nervous = new Nervous(this);
      this.nervous.eyes = new Nervous.Eyes(this.nervous, level.solidityMap);
      this.nervous.ears = new Nervous.Ears(this.nervous, ig.amp);

      // spurt blood on damage
      ig.andro.augment(this, BloodSpurter, { count: 7, color: "white" });
      ig.andro.augment(this, Passer, { from: "health:receiveDamage", to: "bloodSpurter:go" });

      // explode on kill
      ig.andro.augment(this, Passer, { from: "owner:kill", to: "benignExploder:go" });
      ig.andro.augment(this, BenignExploder, {
        count: 10, size: 2, color: "white", force: 7
      });

      ig.andro.augment(this, Targeter, { level: level });

      // set target to source of shots fired
      ig.andro.augment(this, {
        setup: function(owner, eventer) {
          owner.nervous.ears.listenTo("shooting", function(obj) {
            if(owner.isInView()
               && !ig.util.inInstances(obj, [EntityEnemy, EntitySentry])
               && !owner.gotTarget()) { // prioritise sight target
              owner.target = obj;
            }
          });
        }
      });

      // turn towards thing being tracked
      ig.andro.augment(this, {
        setup: function(owner, eventer) {
          eventer.bind(this, "owner:update", function() {
            if(owner.gotTarget()) {
              owner.rotateTowards(ig.maths.vectorToAngle(
                ig.maths.vectorTo(owner.pos, owner.target.pos)));
            }
          });
        }
      });

      // shoot when looking at enemy
      ig.andro.augment(this, {
        lastShot: 0,
        setup: function(owner, eventer) {
          eventer.bind(this, "owner:update", function() {
            if(ig.maths.timePassed(this.lastShot, owner.shotDelay)) {
              if(owner.gotTarget()) {
                var gazeVector = ig.maths.angleToVector(owner.getAngleD());
                var observee = owner.nervous.eyes.lookInDirection(gazeVector);

                if(ig.maths.inside(observee.point, owner.target)) {
                  var v = ig.maths.normalise(ig.maths.vectorTo(owner.pos, owner.target.pos));
                  var ammoSize = owner.ammoData[owner.ammoType].size;
                  ig.game.spawnEntity(eval(owner.ammoType),
                                      (owner.pos.x + owner.size.x / 2)
                                      + (v.x * owner.size.x
                                         + (ig.maths.identitySign(v.x) * ammoSize.x)),
                                      (owner.pos.y + owner.size.y / 2)
                                      + (v.y * owner.size.y
                                         + (ig.maths.identitySign(v.y) * ammoSize.y)),
                                      { vector: v, owner: owner });

                  var soundName = owner.ammoData[owner.ammoType].sound;
                  if(soundName !== undefined) {
                    ig.sounder.play(soundName);
                  }

                  ig.amp.sound("shooting", owner);
                  this.lastShot = new Date().getTime();
                }
              }
            }
          });
        }
      });
    },

    ammoData: {
      "EntityBullet": { sound: "gunshotSound", size: { x:1, y:1 } },
      "EntityRocket": { sound: undefined, size: { x:7, y:3 } }
    },

    rotateTowards: function(targetAngle) {
      this.rotate(ig.maths.quickestDirection(this.getAngleD(), targetAngle, 360));
    },

    // non-physical rotation that breaks contacts etc, but that's OK
    rotate: function(direction) {
      var pos = new b2.Vec2((this.pos.x + (this.size.x / 2)) * b2.SCALE,
                            (this.pos.y + (this.size.y / 2)) * b2.SCALE);
      var angleD = this.getAngleD();
      if(direction === ig.maths.DIR.LEFT.id) {
        angleD = ig.maths.dial(this.getAngleD(), -this.turnSpeed, 360);
      }
      else if(direction === ig.maths.DIR.RIGHT.id) {
        angleD = ig.maths.dial(this.getAngleD(), this.turnSpeed, 360);
      }

      this.body.SetXForm(pos, ig.maths.degToRad(angleD));
    },

    update: function() {
      this.parent();
      this.handleAnim();
    },

    kill: function() {
      ig.checkpointer.event({
        clazz: EntitySentry, pos: this.pos, settings: this.initSettings,
        fn: function() {
          this.setup(ig.leveler);
        }
      });

      this.parent();
    },

    getCurrentAnim: function() {
      return this.anims[this.damageLevel()];
    },

    handleAnim: function() {
      var potentialAnim = this.getCurrentAnim();
      if(this.currentAnim !== potentialAnim) {
        this.currentAnim = potentialAnim;
      }

      if(this.currentAnim !== undefined) {
        this.currentAnim.angle = ig.maths.degToRad(ig.maths.dial(this.getAngleD(), -90, 360));
      }
    },

    canSee: function(obj) {
      var angleTo = ig.maths.vectorToAngle(ig.maths.vectorTo(this.pos, obj.getPosition()));
      var curAngle = this.getAngleD();
      return ig.maths.withinSegment(angleTo,
                                    ig.maths.dial(curAngle, -110, 360),
                                    ig.maths.dial(curAngle, 110, 360)) // in field of view
        && this.nervous.eyes.lookAt(obj).visible(); // view not blocked
    },

    getEnemies: function() {
      return ig.util.addAll([ig.game.player], ig.game.getEntitiesByType(EntityTurretBlock));
    },

    addAnims: function() {
      this.animSheet = new ig.AnimationSheet('media/human.png', 39, 39);
      for(var dl = 0; dl < this.getDamageLevels(); dl++) {
	      this.addAnim(dl, 1, [0 * this.getDamageLevels() + dl]);
      }
    }
  });
});
