ig.module(
  'game.entities.particle'
).requires(
  'plugins.box2d.entity'
).defines(function(){
  EntityParticle = ig.Box2DEntity.extend({
	  init: function(x, y, settings) {
      this.size = { x: settings.width, y: settings.height };

      this.absorbedBy = [];
      if(settings.absorbedBy !== undefined) {
        this.absorbedBy = settings.absorbedBy;
      }

      // default to being a bullet
      if(settings.bullet === undefined) {
        settings.bullet = true;
      }

      if(settings.density === undefined) {
        settings.density = 1;
      }

      if(settings.restitution === undefined) {
        settings.restitution = 0.5;
      }

      if(settings.collisionStart === undefined) {
        this.collisionStart = 300;
      }

      if(settings.maxLife === undefined) {
        this.maxLife = 4000;
      }

      if(settings.dangerous === undefined) {
        this.dangerous = false;
      }

      if(settings.antiGravity === undefined) {
        this.antiGravity = false;
      }

      this.birth = new Date().getTime();

   	  this.parent(x, y, settings);
      this.setupDestroy();
      this.addAnims(settings.color);
	  },

    update: function() {
      this.parent();
      if(this.antiGravity === true) {
	      this.body.ApplyForce(new b2.Vec2(0, -18), this.body.GetPosition());
      }
    },

    setupDestroy: function() {
      var self = this;
      this.destroyTimeout = setTimeout(function() {
        self.reapReady();
      }, this.maxLife * Math.random());
    },

    collision: function(ownShape, otherShape, contactType) {
      var otherEntity = otherShape.GetBody().entity;
      if(contactType === "add"
         && ig.maths.timePassed(this.birth, this.collisionStart)
         && ig.util.inInstances(otherEntity, this.absorbedBy)) {
        if(this.dangerous === true
           && otherEntity !== undefined
           && otherEntity.receiveDamage !== undefined) {
          // note that there could be double hits at the moment (no equiv of isPotent)
          otherEntity.receiveDamage(1, this);
        }

        clearTimeout(this.destroyTimeout);
        this.reapReady();
      }
    },

    // called when old level unloaded - removes old particles so
    // they don't exist out of bounds in new level
    tearDown: function() {
      this.reapReady();
    },

    addAnims: function() {
      this.animSheet = new ig.AnimationSheet('media/particle' + this.size.x + 'x' + this.size.y
                                             + '.png', this.size.x, this.size.y);

      this.addAnim('idle', 1, [ig.maths.COLOR_TO_SPRITE[this.color]]);
    }
  });
});
