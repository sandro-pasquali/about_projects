;(function() {
  this.DamageOnTouch = {
    setup: function(owner, eventer) {
      this.owner = owner;
      eventer.bind(this, "TouchCount:touching", this.touch);
    },

    touch: function(data) {
      if(data.otherEntity instanceof EntityHuman) {
        if(this.movingAtDamageSpeed()) {
          data.otherEntity.receiveDamage(1, data.selfEntity);
        }
      }
    },

    movingAtDamageSpeed: function() {
      return this.owner.body.m_linearVelocity.x > this.DAMAGE_SPEED ||
        this.owner.body.m_linearVelocity.y > this.DAMAGE_SPEED;
    },

    DAMAGE_SPEED: 30
  };
}).call(this);