;(function() {
  this.ClearColorOnTouch = {
    setup: function(owner, eventer) {
      owner.setAnim(owner.color + "throb");

      var self = this;
      eventer.bind(this, "TouchCount:newlyTouching", function(data) {
        ig.leveler.clearBy(EntityDoorActionBlock, function(entity) {
          eventer.unbind(self, "TouchCount:newlyTouching");
          owner.setAnim(owner.color + "on_full");

          return entity["color"] == owner.color && ig.mover.inView(entity);
        });
      });
    }
  };
}).call(this);