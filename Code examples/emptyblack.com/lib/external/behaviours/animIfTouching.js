;(function() {
  this.AnimIfTouching = {
    setup: function(owner, eventer, settings) {
      owner.setAnim(owner.color + settings.noTouch);

      eventer.bind(this, "TouchCount:newlyTouching", function() {
        owner.setAnim(owner.color + settings.touch);
      });

      eventer.bind(this, "TouchCount:newlyNotTouching", function() {
        owner.setAnim(owner.color + settings.noTouch);
      });
    }
  };
}).call(this);
