;(function() {
  this.AntiGravity = {
    setup: function(owner, eventer, settings) {
      eventer.bind(this, "owner:update", function() {
	      owner.body.ApplyForce(new b2.Vec2(0, settings.y), owner.body.GetPosition());
      });
    }
  };
}).call(this);