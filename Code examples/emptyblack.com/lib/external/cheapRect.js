;(function() {
  function CheapRect(obj, x, y, r, b) {
	if(obj !== null)
	{
      var pos = obj.getPosition();
	  this.x = pos.x;
	  this.y = pos.y;
	  this.r = this.x + obj.size.x;
	  this.b = this.y + obj.size.y;
	}
	else
	{
	  this.x = x;
	  this.y = y;
	  this.r = r;
	  this.b = b;
	}
  };

  CheapRect.gen = function(obj) {
    if(obj.staticRect)
      return obj.staticRect;
    else
      return new CheapRect(obj);
  };

  CheapRect.prototype = {
	isIntersecting: function(rect) {
	  return !(this.r < rect.x || this.x > rect.r || this.y > rect.b || this.b < rect.y);
	},

    get: function() { return this; }
  };

  this.CheapRect = CheapRect;


}).call(this);