ig.module(
  'game.entities.enemy'
).requires(
  'game.entities.human'
).defines(function(){
  EntityEnemy = EntityHuman.extend({

	  init: function(x, y, settings) {
	    this.parent(x, y, settings);
      this.name = "Human enemy" + this.id;
	  },

    setup: function(level) {
      if(ig.editor === undefined) {
        this.nervous = new Nervous(this);
        this.nervous.ears = new Nervous.Ears(this.nervous, ig.amp);
        this.nervous.eyes = new Nervous.Eyes(this.nervous, level.solidityMap);

        if(this.sentry !== "true") {
          this.nervous.ears.listenTo("shooting", this.notifyShooting);
        }

        ig.andro.augment(this, Targeter, { level: level });

        this.setupMachine();
      }
    },

    getHealthMax: function() {
      return 5;
    },

    update: function() {
	    this.parent(); // move
      if(this.isInView()) {
        this.state = this.state.tick();
      }
	  },

    canSee: function(obj) {
      var angleTo = ig.maths.vectorToAngle(ig.maths.vectorTo(this.pos, obj.getPosition()));
      var curAngle = ig.maths.DIR[this.direction].angle;
      return ig.maths.withinSegment(angleTo,
                                    ig.maths.dial(curAngle, -90, 360),
                                    ig.maths.dial(curAngle, 90, 360)) // in field of view
        && this.nervous.eyes.lookAt(obj).visible(); // view not blocked
    },

    getEnemies: function() {
      return ig.util.addAll([ig.game.player], ig.game.getEntitiesByType(EntityTurretBlock));
    },

    notifyFootfall: function(stepper) {
      if(stepper !== this) {
        this.turn(ig.collider.directionOf(this, stepper));
        this.danger();
      }
    },

    notifyShooting: function(shooter) {
      if(this.isInView()
         && !ig.util.inInstances(shooter, [EntityEnemy, EntitySentry])
         && !this.gotTarget()) { // prioritise sight target
        this.turn(ig.collider.directionOf(this, shooter));
        this.danger();
      }
    },

    timeToTurn: function(dir) {
      var extremities = ig.collider.getMoveExtremeties(this);

      return this.direction === ig.maths.opposite(dir) &&
        extremities !== undefined
        && extremities[this.direction] !== null &&
        ig.maths.distance(extremities[this.direction].pos, this.pos) < this.TURN_DISTANCE;
    },

    enemyInSights: function() {
      if(this.gotTarget()
         && this.target.isAlive()) {
        var directionAngle = ig.maths.dirData(this.direction).angle;
        var enemyAngle = ig.maths.vectorToAngle(ig.maths.vectorTo(this.getPosition(),
                                                                  this.target.getPosition()));
        return ig.maths.withinRange(enemyAngle, directionAngle, 15);
      }

      return false;
    },

    kill: function() {
      ig.checkpointer.event({
        clazz: EntityEnemy, pos: this.pos, settings: this.initSettings,
        fn: function() {
          this.setup(ig.leveler);
        }
      });

      this.parent();
    },

    lastDanger: 0,
    danger: function() { this.lastDanger = new Date().getTime(); },
    onAlert: function() { return !ig.maths.timePassed(this.lastDanger, this.DANGER_COOL_OFF);},

    DANGER_COOL_OFF: 1000,
    TURN_DISTANCE: 20,
    DAMAGE_SHOT_DELAY: 500,
    SHOT_DELAY: 250,

    setupMachine: function() {
      this.state = ig.machine.generateTree(this.machineTree, this, {
        canPatrol: function() {
          return !this.onAlert()
            && !this.gotTarget()
            && ig.collider.getMoveExtremeties(this)[this.direction] !== null; //got patrol dest
        },
        patrol: function() {
          if(this.timeToTurn(ig.maths.DIR.LEFT.id)) {
            this.turn(ig.maths.DIR.LEFT.id);
          } else if(this.timeToTurn(ig.maths.DIR.RIGHT.id)) {
            this.turn(ig.maths.DIR.RIGHT.id);
          }

          this.step(200, 2);
        },

        canTrackEnemy: function() {
          return this.gotTarget();
        },
        trackEnemy: function() {
          if(this.gotTarget()) { // possible that target got lost (async) during transition
            this.turn(ig.collider.directionOf(this, this.target));
          }
        },

        canFight: function() {
          return this.gotTarget();
        },

        canShootBullet: function() {
          return ig.maths.timePassed(this.lastShot, this.SHOT_DELAY) &&
            ig.maths.timePassed(this.lastReceivedDamage, this.DAMAGE_SHOT_DELAY) &&
            this.enemyInSights();
        },
        shootBullet: function() {
          this.shootBullet();
        },
      });
    },

    machineTree: {
      identifier: "idle", strategy: "prioritised",
      children: [
        { identifier: "patrol" },
        {
          identifier: "fight", strategy: "sequential",
          children: [
            { identifier: "trackEnemy" },
            { identifier: "shootBullet" },
          ]
        }
      ]
    }
  });
});
