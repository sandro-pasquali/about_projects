ig.module(
  'game.entities.bullet'
).requires(
  'impact.entity',
  'plugins.box2d.entity'
).defines(function(){

  EntityBullet = ig.Box2DEntity.extend({
	  size: {x: 2, y: 2},

	  animSheet: new ig.AnimationSheet('media/bullet.png', 2, 2),

    SPEED: 18,
    isPotent: true, // set to false on coll to stop it doing further damage until removal

	  init: function(x, y, settings) {
      settings.bullet = true;
      settings.density = 10;
	    this.parent( x, y, settings );

      this.owner = settings.owner;

      ig.andro.setup(this);
      ig.andro.augment(this, KillOnOffscreen);
      ig.andro.augment(this, AntiGravity, { y: -18 });

	    this.addAnim( 'idle', 1, [0] );

      var jitter = function(value) {
        var proportion = 0.1
        return (value - (proportion / 2)) + (proportion * Math.random());
      };

	    var x = jitter(settings.vector.x) * this.SPEED;
	    var y = jitter(settings.vector.y) * this.SPEED;
	    this.body.ApplyImpulse(new b2.Vec2(x, y), this.body.GetPosition());
	  },

    collision: function(selfShape, otherShape, contactType) {
      var entity = otherShape.GetBody().entity;
      if(contactType == "add") {
        if(this.isPotent === true
           && this.owner !== entity
           && entity !== undefined
           && !entity.isSensor) {
          this.isPotent = false; // stop being potent before being removed
          if(entity.receiveDamage !== undefined) {
            entity.receiveDamage(1, selfShape.GetBody().entity);
          }
        }
      }

      if(contactType === "result"
         && (entity === undefined || !entity.isSensor)) {
        this.reapReady();
        ig.contactResolver.resolveFor(this);
      }
    }
  });
});