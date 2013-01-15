;(function() {
  this.BenignExploder = {
    setup: function(owner, eventer, settings) {
      eventer.bind(this, "benignExploder:go", function() {
        var absorbedBy = [EntityHuman];

        for(var i = 0; i < settings.count; i++) {
          ig.spawner.add(EntityParticle, owner.pos, {
            width: settings.size, height: settings.size, color: settings.color,
            density:1, collisionStart: 300, maxLife: 4000,
            bullet: false, absorbedBy: absorbedBy
          }, function() {
            this.body.ApplyImpulse(new b2.Vec2((Math.random() - 0.5) * settings.force,
                                               (Math.random() - 0.7) * settings.force),
                                   this.body.GetPosition());
          });
        }
      });
    }
  };
}).call(this);