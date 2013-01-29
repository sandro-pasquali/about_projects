function Collider() { };

Collider.prototype = {

  getMoveExtremeties: function(obj) {
    var extremities = {};
    extremities[ig.maths.DIR.LEFT.id] = null;
    extremities[ig.maths.DIR.RIGHT.id] = null;

    var hints = ig.game.getEntitiesByType(EntityEdgeHint);
    for(var i = 0; i < hints.length; i++) {
      var hint = hints[i];
      if(this.lineOfFireDir(obj, hint) !== null) {
        var distance = ig.maths.distance(hint.pos, obj.pos);
        if(distance < 350) {
          var dir = this.directionOf(obj, hint);
          if(extremities[dir] === null
             || distance < ig.maths.distance(extremities[dir].pos, obj.pos)) {
            extremities[dir] = hint;
          }
        }
      }
    }

    return extremities;
  },

  // the spreads are added to either side of the object to generate the danger zone
  lineOfFireDir: function(shooter, target, inXSpread, inYSpread) {
	  var lineOfFireDir = null;
    var shooterCenter = shooter.getCenter();
	  var targetRect = CheapRect.gen(target);

	  var xSpread = ig.system.width; // default to farthest distance within view
	  if(inXSpread !== undefined)
	    xSpread = inXSpread;

	  var ySpread = 0;
	  if(inYSpread !== undefined)
	    ySpread = inYSpread;

	  if(shooterCenter.y <= targetRect.b + ySpread && shooterCenter.y >= targetRect.y - ySpread){
	    if(targetRect.r < shooterCenter.x && targetRect.r > shooterCenter.x - xSpread) {
		    lineOfFireDir = ig.maths.DIR.LEFT.id;
      }
	    else if(targetRect.x > shooterCenter.x && targetRect.r < shooterCenter.x + xSpread) {
		    lineOfFireDir = ig.maths.DIR.RIGHT.id;
      }
	  }

	  return lineOfFireDir;
  },

  directionOf: function(fromObj, toObj) {
	  if(fromObj.getPosition().x < toObj.getPosition().x)
	    return ig.maths.DIR.RIGHT.id;
    else
      return ig.maths.DIR.LEFT.id;
  },

  isOwnedBy: function(shape, potentialOwner) {
    return shape.GetBody().entity !== undefined &&
      shape.GetBody().entity.owner === potentialOwner;
  },

  setupContactListener: function() {
    var contactHandler = function(shape1, shape2, contactType) {
      if(shape1.GetBody().entity !== undefined) {
        if(shape1.GetBody().entity.collision !== undefined) {
          shape1.GetBody().entity.collision(shape1, shape2, contactType);
        }
      }

      if(shape2.GetBody().entity !== undefined) {
        if(shape2.GetBody().entity.collision !== undefined) {
          shape2.GetBody().entity.collision(shape2, shape1, contactType);
        }
      }
    };

    var WorldContactListener = function(){};
    WorldContactListener.prototype = new b2.ContactListener();
    WorldContactListener.prototype.Add = function(point) {
      contactHandler(point.shape1, point.shape2, "add");
    };

    WorldContactListener.prototype.Result = function(point) {
      contactHandler(point.shape1, point.shape2, "result");
    };

    WorldContactListener.prototype.Remove = function(point) {
      contactHandler(point.shape1, point.shape2, "remove");
    };

    WorldContactListener.prototype.Persist = function(point) {
      contactHandler(point.shape1, point.shape2, "persist");
    };

    ig.world.SetContactListener(new WorldContactListener());
  },

  // constants for different solidity map materials
  materials: {
    EMPTY: 0,
    WALL: 1,

    HUMAN: 2,
    MOVEABLE_BLOCK: 3
  },
};
