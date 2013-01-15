ig.module(
  'game.entities.human'
).requires(
  'impact.entity',
  'plugins.box2d.entity'
).defines(function(){

  EntityHuman = ig.Box2DEntity.extend({
	  size: { x: 13, y: 13 },
	  offset: { x: 13, y: 13 },

	  animSheet: new ig.AnimationSheet('media/human.png', 39, 39),

	  direction: null,
    sword: null,

    damaged: false,
    health: null,

	  init: function(x, y, settings) {
      settings.friction = 1;
      settings.restitution = 0;
      settings.density = 1.5;

      this.setChangeableSetting(settings, "canShootBullet", "yes");
      this.setChangeableSetting(settings, "canStab", "no");
      this.setChangeableSetting(settings, "canShootRocket", "no");

	    this.parent( x, y, settings );
      this.setChangeableSetting(settings, "initialDirection", "LEFT");

      this.turn(settings.initialDirection);

      this.addAnims();

      // humans might start invisible - avoid initial flash before first hide
      this.currentAnim = null;

      this.health = this.getHealthMax();

      if(ig.editor === undefined) {
        ig.andro.setup(this);
        ig.andro.augment(this, BloodSpurter, { count: 10, color: "white" });

        // explode on kill
        ig.andro.augment(this, Passer, { from: "owner:kill", to: "benignExploder:go" });
        ig.andro.augment(this, BenignExploder, {
          count: 10, size: 2, color: "white", force: 7
        });
      }
	  },

    setup: function(solidityMap) {    },

    material: function() { return ig.collider.materials.HUMAN; },

  	createBody: function(settings) {
      settings.fixedRotation = true;
      this.parent(settings);
      this.addSensor("bottomSensor",
                     0, (this.size.y / 2),
                     (this.size.x - 2) / 2, 1);
      this.addSensor("leftSensor",
                     -(this.size.x / 2) - 0, 0,
                     1, (this.size.y / 2) - 1);
      this.addSensor("rightSensor",
                     (this.size.x / 2) + 0, 0,
                     1, (this.size.y / 2) - 1);
	  },

    SHOOT_DELAY: 300,
    lastShot: 0,
    shootBullet: function(direction) {
      if(this.canShootBullet === "no") return

      if(ig.maths.timePassed(this.lastShot, this.SHOOT_DELAY)) {
        if(direction === undefined) {
          direction = this.direction;
        }

        var spawnPos = this.getProjectileSpawnPos(direction, 2);
	      ig.game.spawnEntity(EntityBullet, spawnPos.x, spawnPos.y, {
          vector: ig.maths.DIR[direction].v,
          owner: this,
        });

        this.lastShot = new Date().getTime();
        ig.sounder.play("gunshotSound");
      }
    },

    shootRocket: function(direction) {
      if(this.canShootRocket === "no") return

      if(direction === undefined) {
        direction = this.direction;
      }

      var explodedRocket = false;
      var rockets = ig.game.getEntitiesByType(EntityRocket);
      for(var i = 0; i < rockets.length; i++) {
        if(rockets[i].owner === this) {
          rockets[i].reapReady();
          explodedRocket = true;
          break;
        }
      }

      if(explodedRocket === false) {
        var spawnPos = this.getProjectileSpawnPos(direction, 6);
	      ig.game.spawnEntity(EntityRocket, spawnPos.x, spawnPos.y, {
          vector: ig.maths.DIR[direction].v,
          owner: this,
        });
      }

      //ig.sounder.sounds["shootRocket"].play();
      ig.amp.sound("shooting", this);
    },

    getProjectileSpawnPos: function(direction, projectileWidth) {
      var velX = this.body.GetLinearVelocity().x;
      var addSpeed = velX / 2;

      // diving backwards firing, so offset spawn x to other side
      if(!((velX > 0 && direction === ig.maths.DIR.RIGHT.id) ||
           (velX < 0 && direction === ig.maths.DIR.LEFT.id))) {
        addSpeed = addSpeed * (-1);
      }

	    return {
        x: this.pos.x + (direction === ig.maths.DIR.LEFT.id
                         ? addSpeed - projectileWidth - 2
                         : this.size.x + addSpeed + projectileWidth),
        y: this.pos.y + this.size.y / 3 + 1
      }
    },

    stab: function() {
      if(this.canStab === "no") return
      this.drawSword();
      ig.sounder.play("swordSound");
      ig.amp.sound("shooting", this);
    },

    drawSword: function() {
      var self = this;
      this.sword = ig.game.spawnEntity(EntitySword, 0, 0, {
        owner: this,
        killCallback: function() {
          var swordIndex = self.dependents.indexOf(self.sword);
          self.dependents.splice(swordIndex, 1);
          self.sword = null;
        }
      });

      this.dependents.push(this.sword);
    },

    isSwordOut: function() { return this.sword !== null; },
    isSkewering: function() { return this.sword !== null && this.sword.isSkewering(); },

    swordStatus: function() {
      var status = ""
      if(this.isSwordOut()) {
        status += this.sword.isSkewering() ? "skewering" : "stabbing";
        if(this.verticalDirection == ig.maths.DIR.DOWN.id &&
           !this.sword.isSkewering()) {
          status += ig.maths.DIR.DOWN.id;
        }
      }

      return status;
    },

    lastReceivedDamage: 0,
    DAMAGE_SHOW_TIME: 200,
    receiveDamage: function(amount, from) {
      if(this.health > 0) { // health gets decrements multiple times for some weird reason
		    this.health -= amount;
        this.lastReceivedDamage = new Date().getTime();
        this.damaged = true;

        // disable these sounds - getting distortion because of too many simultaneous channels
        // if(from instanceof EntityBullet
        //    || (from instanceof EntityParticle && from.dangerous === true)) {
        //   ig.game.bulletHitSound.play();
        // }
        // else if(from instanceof EntitySword) {
        //   // play sword stab sound here
        // }

        if(!(from instanceof EntityParticle)) { // reduce load on Box2D
          ig.andro.eventer(this).emit("bloodSpurter:go", from);
        }

		    if(this.health <= 0) {
          this.die();
		    }
      }
    },

    die: function() {
	    this.reapReady();
    },

    update: function() {
      this.parent();
      this.handleAnim();
    },

    getCurrentAnim: function() {
      return this.anims[this.direction + this.damageLevel() + this.swordStatus()];
    },

    damageLevel: function() {
      return Math.ceil((this.DL / this.getHealthMax()) * this.health) - 1;
    },

    handleAnim: function() {
      var potentialAnim = this.getCurrentAnim();
      if(this.currentAnim !== potentialAnim) {
        this.currentAnim = potentialAnim;
      }
    },

    step: function(moveForce, maxSpeed) {
	    this.body.ApplyForce(new b2.Vec2(this.getSpeed(this.direction, moveForce, maxSpeed), 0),
                           this.body.GetPosition());
    },

    getSpeed: function(dir, moveForce, maxSpeed) {
      var force = 0;
      if(Math.abs(this.body.m_linearVelocity.x) < maxSpeed ||
         this.isReversing(dir)) {
        force = moveForce;
      }

      return ig.maths.dirData(dir).sign * force;
    },

    isReversing: function(dir) {
      return dir == ig.maths.DIR.LEFT.id && this.body.m_linearVelocity.x > 0 ||
        dir == ig.maths.DIR.RIGHT.id && this.body.m_linearVelocity.x < 0;
    },

    kill: function() {
      ig.contactResolver.resolveFor(this);
      this.parent();
    },

    turn: function(direction) {
      this.direction = direction;
    },

    DL: 9, // damage levels
    addAnims: function() {
      for(var dl = 0; dl < this.DL; dl++) {
	      this.addAnim(ig.maths.DIR.RIGHT.id + dl, 1, [0 * this.DL + dl]);
	      this.addAnim(ig.maths.DIR.LEFT.id + dl, 1, [1 * this.DL + dl]);

	      this.addAnim(ig.maths.DIR.RIGHT.id + dl + "stabbing", 1, [4 * this.DL + dl]);
	      this.addAnim(ig.maths.DIR.LEFT.id + dl + "stabbing", 1, [5 * this.DL + dl]);
	      this.addAnim(ig.maths.DIR.RIGHT.id + dl + "stabbing" + ig.maths.DIR.DOWN.id, 1,
                     [8 * this.DL + dl]);
	      this.addAnim(ig.maths.DIR.LEFT.id + dl + "stabbing" + ig.maths.DIR.DOWN.id, 1,
                     [9 * this.DL + dl]);

	      this.addAnim(ig.maths.DIR.RIGHT.id + dl + "skewering", 1, [12 * this.DL + dl]);
	      this.addAnim(ig.maths.DIR.LEFT.id + dl + "skewering", 1, [13 * this.DL + dl]);

        // damaged
	      this.addAnim(ig.maths.DIR.RIGHT.id + dl + "damaged", 1, [2 * this.DL + dl]);
	      this.addAnim(ig.maths.DIR.LEFT.id + dl + "damaged", 1, [3 * this.DL + dl]);

	      this.addAnim(ig.maths.DIR.RIGHT.id + dl + "stabbing" + "damaged",
                     1, [6 * this.DL + dl]);
	      this.addAnim(ig.maths.DIR.LEFT.id + dl + "stabbing" + "damaged",
                     1, [7 * this.DL + dl]);
	      this.addAnim(ig.maths.DIR.RIGHT.id + dl + "stabbing" + ig.maths.DIR.DOWN.id +"damaged",
                     1, [10 * this.DL + dl]);
	      this.addAnim(ig.maths.DIR.LEFT.id + dl + "stabbing" + ig.maths.DIR.DOWN.id + "damaged",
                     1, [11 * this.DL + dl]);

	      this.addAnim(ig.maths.DIR.RIGHT.id + dl + "skewering" + "damaged",
                     1, [14 * this.DL + dl]);
	      this.addAnim(ig.maths.DIR.LEFT.id + dl + "skewering" + "damaged",
                     1, [15 * this.DL + dl]);
      }
    },

    NOISY_MOVEMENT_X: 100,
    NOISY_MOVEMENT_Y: 40,
  });
});
