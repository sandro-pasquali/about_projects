ig.module(
  'plugins.box2d.entity'
).requires(
  'impact.entity',
  'plugins.box2d.game'
).defines(function(){

  // framechange - tons of changes
  ig.Box2DEntity = ig.Entity.extend({
	  body: null,
	  angle: 0,
    sensors: null,
    dependents: null,

	  init: function( x, y , settings ) {
	    this.parent( x, y, settings );
      this.sensors = [];
      this.dependents = [];

	    if( !ig.global.wm ) {
		    this.createBody(settings);
	    }
	  },

	  createBody: function(settings) {
      var bodyDef = this.makeBodyDef(settings);
      this.body = this.makeBodyObj(bodyDef, settings);
      var shapeDef = this.makeMainShapeDef(settings);
      this.adjustMainShapeDef(shapeDef, settings);

	    this.body.CreateShape(shapeDef);
      this.body.SetMassFromShapes();

      this.body.entity = this;
	  },

    makeBodyDef: function(settings) {
	    var bodyDef = new b2.BodyDef();

      if(settings.fixedRotation === true) {
        bodyDef.fixedRotation = true;
      }

	    bodyDef.position.Set(
		    (this.pos.x + this.size.x / 2) * b2.SCALE,
		    (this.pos.y + this.size.y / 2) * b2.SCALE
	    );

      return bodyDef;
    },

    makeBodyObj: function(bodyDef, settings) {
	    var body = ig.world.CreateBody(bodyDef);
      if(settings.bullet === true) {
        body.SetBullet(true);
      }

      return body;
    },

    makeMainShapeDef: function() {
	    var shapeDef = new b2.PolygonDef();

	    shapeDef.SetAsBox(
		    this.size.x / 2 * b2.SCALE,
		    this.size.y / 2 * b2.SCALE
	    );

      return shapeDef;
    },

    adjustMainShapeDef: function(shapeDef, settings) {
      if(settings.isSensor === true)
        shapeDef.isSensor = true;

      if(settings.density !== undefined) {
        shapeDef.density = settings.density;
      }
      else {
        shapeDef.density = 0;
      }

      if(settings.restitution !== undefined) {
	      shapeDef.restitution = settings.restitution;
      }

      if(settings.friction !== undefined) {
	      shapeDef.friction = settings.friction;
      }

      return shapeDef;
    },

    addSensor: function(id, x, y, width, height) {
	    var sensor = new b2.PolygonDef();
      sensor.SetAsOrientedBox(width * b2.SCALE,
                              height * b2.SCALE,
                              new b2.Vec2(x * b2.SCALE, y * b2.SCALE),
                              0);

	    sensor.isSensor = true;
	    sensor.userData = {
        id: id,
      };

	    this.sensors[id] = this.body.CreateShape(sensor);
      this.sensors[id].isSensor = true;
    },

	  update: function() {
	    var p = this.body.GetPosition();
	    this.pos = {
		    x: (p.x / b2.SCALE - this.size.x / 2),
		    y: (p.y / b2.SCALE - this.size.y / 2 )
	    };
	    this.angle = this.body.GetAngle().round(2);

	    if( this.currentAnim ) {
		    this.currentAnim.update();
		    this.currentAnim.angle = this.angle;
	    }

      this.emit("owner:update");
	  },

    getAngleR: function() {
      return this.body.GetAngle();
    },

    getAngleD: function() {
      return ig.maths.radToDeg(this.body.GetAngle());
    },

	  kill: function() {
      if(this.isAlive()) {
	      ig.world.DestroyBody(this.body);
        for(var i = 0; i < this.dependents.length; i++) {
          this.dependents[i].kill();
        }

	      this.parent();
      }
	  },
  });
});