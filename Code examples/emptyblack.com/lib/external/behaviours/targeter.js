;(function() {
  this.Targeter = {
    setup: function(owner, eventer) {
      this.owner = owner;
      this.nonPlayerEnemies = ig.game.getEntitiesByType(EntityTurretBlock);

      this.targeting();

      // (use owner nervous below because don't want to have to define getCenter() etc)

      return {
        gotTarget: this.gotTarget
      }
    },

    targeting: function() {
      // lose target if no longer visible
      // might want to keep if acquired but not in field of view (like by hearing shooting)
      if(ig.mover.inView(this.owner)) {
        if(this.gotTarget()
           && (!this.owner.nervous.eyes.lookAt(this.owner.target).visible()
               || !this.owner.target.isAlive())) {
          this.owner.target = undefined;
        }
        // try and get target
        else if(!this.gotTarget()
                || !ig.mover.inView(this.owner.target)
                || !this.owner.nervous.eyes.lookAt(this.owner.target).visible()) {
          this.owner.target = this.getTarget();
        }
      }
      else {
        this.owner.target = undefined;
      }

      var self = this;
      setTimeout(function() {
        self.targeting(self.owner);
      }, 300);
    },

    isValidTarget: function(obj) {
      return ig.mover.inView(obj)
        && obj.isAlive()
        && this.owner.canSee(obj);
    },

    gotTarget: function() {
      return this.owner.target !== undefined;
    },

    getTarget: function() {
      var enemies = this.owner.getEnemies();
      for(var i = 0; i < enemies.length; i++) {
        if(this.isValidTarget(enemies[i])) {
          return enemies[i];
        }
      }
    }
  }
}).call(this);
