ig.module(
  'game.entities.sword'
).requires(
  'impact.entity',
  'plugins.box2d.entity'
).defines(function(){

  EntitySword = ig.Box2DEntity.extend({
	size: { x: 15, y: 9 },

	animSheet: new ig.AnimationSheet( 'media/bullet.png', 1, 1 ),

    skewered: null,
    skewerState: "unskewered",

	  init: function(_, _, settings) {
      this.owner = settings.owner;
      this.killCallback = settings.killCallback;

      // make sword body
      settings.density = 0.1;
      settings.isSensor = true;

      var pos = this.calculateSwordPos();
	    this.parent(pos.x, pos.y, settings);

      // setup joint between owner and sword
      this.joint = this.makeOwnerSwordJoint();

      this.SKEWERABLE = [EntityCrate, EntityActionBlock];
	  },

    makeOwnerSwordJoint: function() {
      var humanJointPos = new b2.Vec2((this.owner.pos.x) * b2.SCALE,
                                      (this.owner.pos.y) * b2.SCALE);
      var worldAxis = new b2.Vec2(1.0, 0.0);

      var swordJointDef = new b2.PrismaticJointDef();
      swordJointDef.Initialize(this.owner.body, this.body, humanJointPos, worldAxis);
      swordJointDef.enableLimit = true;
      return ig.world.CreateJoint(swordJointDef);
    },

    getSwordDirection: function() {
      if(this.owner.verticalDirection == ig.maths.DIR.DOWN.id) {
        return ig.maths.DIR.DOWN.id;
      }
      else {
        return this.owner.direction;
      }
    },

    calculateSwordPos: function() {
      var pos = {};
      var swordDirection = this.getSwordDirection();
      if(swordDirection == ig.maths.DIR.DOWN.id) {
        pos.x = this.owner.pos.x;
        pos.y = this.owner.pos.y + (this.size.y * 2);
      }
      else if(this.owner.direction == ig.maths.DIR.LEFT.id) {
	      pos.x = this.owner.pos.x - this.size.x - 2;
        pos.y = this.owner.pos.y;
      }
      else if(this.owner.direction == ig.maths.DIR.RIGHT.id) {
	      pos.x = this.owner.pos.x + this.size.x;
        pos.y = this.owner.pos.y;
      }

      return pos;
    },

    isSkewering: function() {
      return this.skewered !== null;
    },

    isSkewerable: function(entity) {
      if(entity.density > 0
         && entity.unskewerable !== "true") {
        for(var i = 0; i < this.SKEWERABLE.length; i++) {
          if(entity instanceof this.SKEWERABLE[i]) {
            return true;
          }
        }
      }

      return false;
    },

    skewer: function(obj) {
      if(this.skewerState === "unskewered") {
        this.skewerState = "begun";

        var self = this;
        ig.runner.add(obj, function(obj) {
          if(self.skewerState === "begun") {
            self.skewerState = "skewered";
            self.skewered = obj;

            // move obj above head of sword owner
            var newPos = new b2.Vec2((self.owner.pos.x + (self.owner.size.x / 2)) * b2.SCALE,
                                     ((self.owner.pos.y - 10) * b2.SCALE));
            obj.body.WakeUp();
            obj.body.SetXForm(newPos, 0);

            // attach
            self.skewerJoint = self.createSkewerJoint(obj);
            obj.skewered();

            // register for skewered object's death - will need to destroy sword
            ig.andro.eventer(obj).bind(this, "owner:kill", function() {
              self.reapReady();
            });
          }
        });
      }
    },

    createSkewerJoint: function(obj) {
      var jointPos = new b2.Vec2((this.owner.pos.x) * b2.SCALE,
                                 (this.owner.pos.y) * b2.SCALE);
      var objPos = new b2.Vec2((obj.pos.x) * b2.SCALE,
                               (obj.pos.y) * b2.SCALE);
      var worldAxis = new b2.Vec2(1.0, 0.0);

      var jointDef = new b2.RevoluteJointDef();
      jointDef.enableLimit = true;
      jointDef.lowerAngle = ig.maths.degToRad(0);
      jointDef.upperAngle = ig.maths.degToRad(0);
      jointDef.Initialize(this.owner.body, obj.body, jointPos, objPos);

      return ig.world.CreateJoint(jointDef);
    },

    unskewer: function() {
      if(this.skewerState === "skewered") {
        var skewered = this.skewered;
        this.skewered = null;

        ig.world.DestroyJoint(this.skewerJoint);

        skewered.body.m_linearVelocity.x = ig.maths.DIR[this.owner.direction].sign * 4;
        if(ig.input.state('left') || ig.input.state('right')) {
          skewered.body.m_linearVelocity.x *= 7;
        }

        if(ig.input.state('jump')) {
          skewered.body.m_linearVelocity.y = -30;
        }

        if(skewered.unskewer !== undefined) {
          skewered.unskewer();
        }
      }

      this.skewerState = "unskewered";
    },

    update: function() {
      if(!ig.input.state('stab')) {
        this.unskewer();
        this.kill();
      }
    },

    kill: function() {
      this.killCallback();
      this.parent();
      ig.contactResolver.resolveFor(this);
    },

    collision: function(ownShape, otherShape, contactType) {
      if(this.isPotent !== false &&
         contactType == "add") {
        var entity = otherShape.GetBody().entity;
        if(ig.util.inInstances(entity, [EntityHuman, EntitySentry])
           && entity !== this.owner
           && !this.isSkewering()) {
          entity.receiveDamage(4, entity);
          this.isPotent = false;
        } else if(entity !== undefined && !this.isSkewering()) {
          if(this.isSkewerable(entity)) {
            this.skewer(entity);
            this.isPotent = false;
          }
        }
      }
    },

    STAB_TIME: 100,
  });
});
