;(function() {
  this.OpenSesame = {
    setup: function(owner, eventer, settings) {
      eventer.bind(this, "owner:update", function() {
        if(ig.input.pressed('opendoors')) {
          ig.leveler.clearBy(settings.type, function(entity) {
            return ig.mover.inView(entity);
          });
        }
      });
    }
  };
}).call(this);
