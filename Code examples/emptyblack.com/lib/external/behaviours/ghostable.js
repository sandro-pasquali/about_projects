;(function() {
  this.Ghostable = {
    setup: function(owner, eventer, settings) {
      this.owner = owner;
      this.nervous = new Nervous(this);
      this.nervous.eyes = new Nervous.Eyes(this.nervous, settings.level.solidityMap);
      this.ghost = new Ghost(this.owner, settings.ghostAnim);

      eventer.bind(this, "owner:draw", this.handleGhostDrawing);
      eventer.bind(this, "owner:update", this.handleVisibleDrawing);
    },

    lastSeenTime: 0,
    handleVisibleDrawing: function() {
      if(this.owner.isInView()) {
        if(ig.editor !== undefined
           || ig.game.player.nervous.eyes.lookAt(this.owner).visible()) {
          this.ghost.ownerVisible(this.owner.pos);
          this.owner.currentAnim = this.owner.getCurrentAnim();
          this.lastSeenTime = new Date().getTime();
        }
        else {
          if(ig.maths.timePassed(this.lastSeenTime, 200)) {
            // delayed because sometimes momentarily "lose sight" but actually
            // just cause nervous SM update is late (I think)
            this.owner.currentAnim = null;
            this.ghost.ownerInvisible();
          }
        }
      }
    },

    handleGhostDrawing: function() {
      if(ig.editor === undefined) {
        this.ghost.draw();
      }
    },

    getSize: function() { return this.owner.size; },
    getCenter: function() { return ig.maths.center(this.owner); },
    getPosition: function() { return this.owner.pos; },
  }
}).call(this);
