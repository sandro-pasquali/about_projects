;(function() {
  function Spawner() {
    this.spawnees = [];
  };

  Spawner.prototype = {
    update: function() {
      this.spawn();
    },

    spawn: function() {
      while(this.spawnees.length > 0) {
        var obj = this.spawnees.pop();
	      var entity = ig.game.spawnEntity(obj.clazz, obj.pos.x, obj.pos.y, obj.settings);
        if(obj.fn !== undefined) {
          obj.fn.call(entity);
        }
      }
    },

    add: function(clazz, pos, settings, fn) {
      this.spawnees.push({
        clazz: clazz,
        pos: { x: pos.x, y: pos.y },
        settings: settings || {},
        fn: fn
      });
    }
  };

  this.Spawner = Spawner;
}).call(this);
