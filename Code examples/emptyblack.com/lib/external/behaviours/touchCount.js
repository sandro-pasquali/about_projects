;(function() {
  this.TouchCount = {
    setup: function(owner, eventer, settings) {
      this.owner = owner;
      this.eventer = eventer;
      this.eligibleFn = settings.eligibleFn;
      this.touching = {};

      ig.contactResolver.add(this);

      eventer.bind(this, "owner:collision", this.collision);
      eventer.bind(this, "owner:kill", this.resolveContacts);

      return {
        "isBeingTouched": this.isBeingTouched,
        "getTouching": this.getTouching
      };
    },

    collision: function(data) {
      var self = this;

      // only records as touching if it has an id (has .entity prop)
      if(this.isEligible(data.otherEntity)) {
        if(data.contactType == "add") {
          this.eventer.emit("TouchCount:touch", data);

          this.touchingUpdates(data, function() {
            self.touching[data.otherEntity.id] = data.otherEntity;
          });
        }
        else if(data.contactType == "remove") {
          this.eventer.emit("TouchCount:untouch", data);

          this.touchingUpdates(data, function() {
            delete self.touching[data.otherEntity.id];
          });
        }
      }
    },

    isEligible: function(obj) {
      if(this.isInternalEligible(obj)) {
        if(this.eligibleFn !== undefined) {
          return this.eligibleFn(obj);
        }
        else {
          return true;
        }
      }

      return false;
    },

    isInternalEligible: function(obj) {
      return !ig.util.inInstances(obj, [EntityParticle]) &&
        (obj === undefined || obj.isSensor !== true);
    },

    touchingUpdates: function(data, touchingUpdateFn) {
      var prevBeingTouched = this.isBeingTouched();

      if(data.otherEntity !== undefined) {
        touchingUpdateFn();
        this.handleStateChange(prevBeingTouched, data);
      }
    },

    handleStateChange: function(prevBeingTouched, data) {
      if(!prevBeingTouched && this.isBeingTouched()) {
        this.eventer.emit("TouchCount:newlyTouching", data);
      }
      else if(prevBeingTouched && !this.isBeingTouched()) {
        this.eventer.emit("TouchCount:newlyNotTouching", data);
      }
    },

    isBeingTouched: function() {
      for(var i in this.touching) {
        return true;
      }

      return false;
    },

    getTouching: function() {
      return this.touching;
    },

    resolveContacts: function(obj) {
      var prevBeingTouched = this.isBeingTouched();
      for(var id in this.touching) {
        if(id == obj.id) {
          var toucher = this.touching[id];
          delete this.touching[id];

          this.eventer.emit("TouchCount:untouch", {
            selfEntity: this.owner,
            otherEntity: toucher,
            contactType: "remove"
          });
        }
      }

      this.handleStateChange(prevBeingTouched);
    }
  };
}).call(this);