function Mover() { };

Mover.prototype = {
  hijacked: false,

  update: function() {
    this.screenFollowPlayer();
  },

  screenFollowPlayer: function() {
	  if(ig.game.player && !this.hijacked) {
      this.moveView(ig.game.player.pos);
    }
  },

  moveView: function(pos) {
    var potentialX = pos.x - ig.system.width/2;
    var right = ig.leveler.getMaxCoordinates().x + ig.system.width;
    if(ig.system.width < ig.leveler.getMaxCoordinates().x
       && potentialX > 0
       && potentialX + ig.system.width < right) {
		  ig.game.screen.x = potentialX;
    }

    var potentialY = pos.y - ig.system.height/2;
    var bottom = ig.leveler.getMaxCoordinates().y + ig.system.height;
    if(ig.system.height < ig.leveler.getMaxCoordinates().y
       && potentialY > 0
       && potentialY + ig.system.height < bottom) {
		  ig.game.screen.y = potentialY;
    }
  },

  centreOn: function(pos, time) {
    this.hijacked = true;
    var startPos = { x: ig.game.player.pos.x, y: ig.game.player.pos.y };
    var startTime = new Date().getTime();
    var endTime = startTime + time;

    var self = this;
    (function handleMoveScreenTo() {
      setTimeout(function() {
        var delta = (new Date().getTime() - startTime) / (endTime - startTime);
        var nextPos = {
          x: startPos.x - ((startPos.x - pos.x) * delta),
          y: startPos.y - ((startPos.y - pos.y) * delta)
        };

        self.moveView(nextPos);
        if(delta < 1) {
          handleMoveScreenTo();
        }
        else {
          self.hijacked = false;
        }
      }, 1);
    })();
  },

  dir: function(a, b) {
    return (a - b) / (a - b);
  },

  getEntitiesInView: function(clazz) {
    var entitiesInView = [];
    var entities = ig.game.getEntitiesByType(clazz);
    for(var i = 0; i < entities.length; i++) {
      if(this.inView(entities[i])) {
        entitiesInView.push(entities[i]);
      }
    }

    return entitiesInView;
  },

  inView: function(obj) {
    return obj.getPosition().x >= ig.game.screen.x &&
      obj.getPosition().x <= ig.game.screen.x + ig.system.width &&
      obj.getPosition().y >= ig.game.screen.y &&
      obj.getPosition().y <= ig.game.screen.y + ig.system.height;
  },
};