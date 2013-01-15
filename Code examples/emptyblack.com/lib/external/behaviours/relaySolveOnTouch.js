;(function() {
  this.RelaySolveOnTouch = {
    setup: function(owner) {
      return {
        isSolved: function() {
          if(owner.sound === undefined && touching === null) {
            return true;
          }

          if(owner.isBeingTouched()) {
            var touchCount = 0;
            var curToucher = null;
            var touchers = owner.getTouching();
            for(var i in touchers) {
              curToucher = touchers[i];
              touchCount++;
            }

            if(touchCount === 1 &&
               curToucher.sound === owner.sound) {
              return true;
            }
          }

          return false;
        }
      };
    }
  };
}).call(this);