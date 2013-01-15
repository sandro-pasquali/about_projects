;(function() {
  this.BloodSpurter = {
    setup: function(owner, eventer, settings) {
      eventer.bind(this, "bloodSpurter:go", function(damagerEntity) {
        var mod = 1 / 20;
        for(var i = 0; i < settings.count; i++) {
          ig.spawner.add(EntityParticle, damagerEntity.pos, {
            width: 1, height: 1, color: settings.color,
            density: 0.2, collisionStart:200, maxLife: 1000
          }, function() {
            var x = ig.maths.spread(damagerEntity.body.m_linearVelocity.x * mod);
            var y = ig.maths.spread(damagerEntity.body.m_linearVelocity.y * mod);
            this.body.ApplyImpulse(new b2.Vec2(x, y), this.body.GetPosition());
          });
        }
      });
    }
  }
}).call(this);
