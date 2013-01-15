;(function() {
  this.Health = {
    setup: function(owner, eventer, settings) {
      this.health = settings.maxHealth;

      return {
        getHealth: function() {
          return this.health;
        },

        getMaxHealth: function() {
          return settings.maxHealth;
        },

        getDamageLevels: function() {
          return 9;
        },

	      receiveDamage: function(amount, from) {
          if(this.health > 0) { // health gets decremented multiple times for some weird reason
		        this.health -= amount;
            eventer.emit("health:receiveDamage", from);
		        if(this.health <= 0) {
	            owner.reapReady();
		        }
          }
        },

        damageLevel: function() {
          return Math.ceil((owner.getDamageLevels() / owner.getMaxHealth())
                           * owner.getHealth()) - 1;
        }
      }
    }
  }
}).call(this);