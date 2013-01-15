ig.module(
  'game.entities.rocket'
).requires(
  'impact.entity',
  'plugins.box2d.entity'
).defines(function(){
  EntityRocket = ig.Box2DEntity.extend({
	  size: { x: 7, y: 3 },

	  animSheet: new ig.AnimationSheet('media/rocket.png', 7, 3),
    SPEED: 60,

	  init: function(x, y, settings) {
      settings.density = 10;
      settings.restitution = 0;
	    this.parent(x, y, settings);

      ig.andro.setup(this);
      ig.andro.augment(this, KillOnOffscreen);
      ig.andro.augment(this, AntiGravity, { y: -94.5 });

      this.owner = settings.owner;
	    this.addAnim('idle', 1, [0]);

      // apply movement force
	    this.body.ApplyImpulse(new b2.Vec2(settings.vector.x * this.SPEED,
                                         settings.vector.y * this.SPEED),
                             this.body.GetPosition());

      // look forwards
      var pos = new b2.Vec2((this.pos.x + (this.size.x / 2)) * b2.SCALE,
                            (this.pos.y + (this.size.y / 2)) * b2.SCALE);
      this.body.SetXForm(pos, ig.maths.degToRad(ig.maths.vectorToAngle(settings.vector) + 90));

      if(ig.editor === undefined) {
        var absorbedBy = [EntityHuman, EntitySentry, EntityBombBlock];
        ig.andro.augment(this, DangerousExploder, {
          count: 10, size: 2, color: "white", force: 10, absorbedBy: absorbedBy
        });

        // explode when killed
        ig.andro.augment(this, {
          setup: function(owner, eventer) {
            eventer.bind(this, "owner:kill", function() {
              if(owner.isInView()) {
                eventer.emit("dangerousExploder:go");
              }
            });
          }
        });
      }
	  },

    isPotent: true,
    collision: function(selfShape, otherShape, contactType) {
      var entity = otherShape.GetBody().entity;
      if(this.isPotent
         && contactType === "result"
         && (entity === undefined
             || ig.util.inInstances(entity, [EntitySentry, EntityHuman, EntityBullet,
                                             EntityActionBlock, EntityCrate]))) {
        if(entity !== undefined && entity.receiveDamage !== undefined) {
          entity.receiveDamage(10, selfShape.GetBody().entity);
        }

        this.isPotent = false;
        this.reapReady();
      }
    }
  });
});
