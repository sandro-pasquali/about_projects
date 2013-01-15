;(function() {
  this.KillOnDamage = {
    setup: function(owner, eventer, settings) {
      return {
        receiveDamage: function(damage, obj) {
          if(ig.util.inInstances(obj, settings.instances)) {
            owner.reapReady();
          }
        }
      }
    }
  }
}).call(this);