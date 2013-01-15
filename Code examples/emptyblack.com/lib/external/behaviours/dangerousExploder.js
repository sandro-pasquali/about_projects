;(function() {
  this.DangerousExploder = {
    setup: function(owner, eventer, settings) {
      eventer.bind(this, "dangerousExploder:go", function() {
        var v = ig.maths.distributedVectors(15);

        for(var i = 0; i < v.length; i++) {
          ig.spawner.add(EntityParticle, {
            x: owner.pos.x + v[i].x * 5, // spawn each particle bit away so they don't bump
            y: owner.pos.y + v[i].y * 5
          }, {
            width: 2, height: 2, color: "white", antiGravity: true, vector: v[i],
            collisionStart: 0, restitution: 1, bullet: false,
            dangerous: true, maxLife: 900, density: 10, absorbedBy: settings.absorbedBy
          }, function() {
            this.body.ApplyImpulse(new b2.Vec2(this.vector.x * settings.force
                                               + (2 * (Math.random() - 0.5)),
                                               this.vector.y * settings.force
                                               + (2 * (Math.random() - 0.5))),
                                   this.body.GetPosition());
          });
        }

        ig.sounder.play("explosionSound");
      });
    }
  }
}).call(this);
