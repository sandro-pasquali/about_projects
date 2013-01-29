ig.module(
  'game.entities.player'
).requires(
  'game.entities.human'
).defines(function(){

  EntityPlayer = EntityHuman.extend({
    init: function(x, y, settings) {
      if(ig.editor === undefined) {
        var lastPos = ig.checkpointer.getLastPos();
        if(lastPos !== undefined) {
          this.parent(lastPos.x, lastPos.y, settings);
        }
        else {
          this.parent(x, y, settings);
        }

        ig.checkpointer.tag(this.pos);
      }
      else {
        this.parent(x, y, settings);
      }
    },

    getHealthMax: function() { return 5; },

	  update: function() {
      this.handleKeyboard();
	    this.parent(); // move
      // fall + jump tuning
      // if(this.showReadout === true && ig.maths.timePassed(this.last, 50)) {
      //   console.log(this.body.m_linearVelocity.y)
      //   this.last = new Date().getTime();
      // }
	  },

    setup: function(level) {
      this.nervous = new Nervous(this);
      this.nervous.eyes = new Nervous.Eyes(this.nervous, level.solidityMap);
    },

    SHOOT_DELAY: 100,
    shootBullet: function() {
      this.parent(this.getSpecialFiringDirection());
      ig.amp.sound("shooting", this);
    },

    shootRocket: function() {
      this.parent(this.getSpecialFiringDirection());
    },

    // might want to shoot away from wall are sticking to
    getSpecialFiringDirection: function() {
      var specialDirection = undefined;
      var result = this.currentSideSensorTouching();
      if(result.sideSensorTouching !== undefined // is touching side
         && result.sensorSplitEdge.otherShape.GetBody().entity === undefined) { // is wall
        specialDirection = result.sideSensorTouching === "leftSensor" ? "RIGHT" : "LEFT";
      }

      return specialDirection;
    },

    handleKeyboard: function() {
	    if(ig.input.state('left')) {
		    this.turn(ig.maths.DIR.LEFT.id);
        this.step();
	    }
	    else if(ig.input.state('right')) {
		    this.turn(ig.maths.DIR.RIGHT.id);
        this.step();
	    }
      else {
        this.stopStep();
      }

      if(ig.input.state("down")) {
        this.verticalDirection = ig.maths.DIR.DOWN.id;
      }
      else {
        this.verticalDirection = null;
      }

      if(ig.input.state('jump')) {
        if(this.canStartJump()) {
          this.startJump();
        }
	    }
      else {
        this.stopJump();
      }

	    if(ig.input.pressed('stab')) {
        this.stab();
      }

	    if(ig.input.pressed('shootBullet')) {
        this.shootBullet();
      }

	    if(ig.input.pressed('shootRocket')) {
        this.shootRocket();
      }

	    if(ig.input.pressed('die')) {
        this.die();
      }

	    if(ig.input.pressed('checkpoint')) {
        ig.checkpointer.tag(this.pos);
      }
    },

    collision: function(selfShape, otherShape, contactType) {
      this.parent(selfShape, otherShape, contactType);
      this.collLastSideSensor(selfShape, otherShape, contactType);
    },

    lastJumpY: null,
    lastSideSensor: null,
    collLastSideSensor: function(selfShape, otherShape, contactType) {
      if(this.shapeIsOneOf(selfShape, ["bottomSensor", "leftSensor", "rightSensor"])
         && !this.shapeIs(selfShape, this.lastSideSensor)) {
        this.lastSideSensor = null; // cancel - can use either sensor, now
      }
    },

    canStartJump: function() {
      return this.body.m_linearVelocity.y >= -0.2 // stops v quick sequence jumps from
                                               // bottomSensor (not needed for side
                                               // sensors because they can't be used twice in
                                               // a row
                                               // can't be 0 because moving with skewered blk
                                               // gives little bumps upwards
        && this.hasFooting();
    },

    hasFooting: function() {
      return this.jumpableContacts(this.body.m_contactList) > 0;
    },

    isClinging: function() {
      var sideSensor = this.currentSideSensorTouching().sideSensorTouching;
      return sideSensor !== undefined
        && !ig.util.inInstances(sideSensor, [EntityParticle]);
    },

    jumpableContacts: function(list) {
      if(list === null) return 0;

      return this.jumpableContact(list) ? 1 : 0
        + this.jumpableContacts(list.next);
    },

    jumpableContact: function(edge) {
      var sensorShape = this.sensorSplitEdge(edge).sensorShape;
      var otherEntity = edge.other.entity;

      return sensorShape !== undefined
        && (this.noContactOrMovingAway(sensorShape)
            || (this.isAtLip()
                && !this.isBottomSensorTouching())) // don't auto allow slipping
        && this.passedIsASensor(sensorShape)
        && this.isAllowableSensorSequence(sensorShape)
        && !this.moveableEntity(otherEntity);
    },

    isAllowableSensorSequence: function(sensorShape) {
      return this.shapeIs(sensorShape, "bottomSensor")
        || !this.shapeIs(sensorShape, this.lastSideSensor)
        || this.lastJumpY < this.pos.y; // prev jump was from higher pos - allow any sensor
                                        // lets player recover from prev fucked same side jump
    },

    // split edge into sensor and other shape
    sensorSplitEdge: function(edge) {
      var shape1 = edge.contact.m_shape1;
      var shape2 = edge.contact.m_shape2;
      var sensorShape = undefined;
      var otherShape = undefined;
      if(shape1 !== undefined
         && this.shapeIsOneOf(shape1, ["bottomSensor", "leftSensor", "rightSensor"])) {
        sensorShape = shape1;
        otherShape = shape2;
      }
      else if(shape2 !== undefined
              && this.shapeIsOneOf(shape2, ["bottomSensor", "leftSensor", "rightSensor"])) {
        sensorShape = shape2;
        otherShape = shape1;
      }

      return { sensorShape: sensorShape, otherShape: otherShape };
    },

    moveableEntity: function(entity) {
      return ig.util.inInstances(entity, [EntityParticle, EntityBullet, EntitySword])
        || (this.isSkewering()
            && this.sword.skewered === entity); // no jump off cntct w/ obj are skewering
    },

    passedIsASensor: function(sensor) {
      return this.shapeIsOneOf(sensor, ["bottomSensor", "leftSensor", "rightSensor"]);
    },

    noContactOrMovingAway: function(selfShape) {
      if(this.shapeIs(selfShape, "leftSensor")) {
        return !ig.input.state('left') && ig.input.state('right');
      }
      else if(this.shapeIs(selfShape, "rightSensor")) {
        return ig.input.state('left') && !ig.input.state('right');
      }

      return true;
    },

    stepping: function() {
      return ig.input.state('left') || ig.input.state('right');
    },

    isBottomSensorTouching: function() {
      var edge = this.body.m_contactList;
      while(edge !== null) {
        var sensorSplitEdge = this.sensorSplitEdge(edge);
        if(sensorSplitEdge.sensorShape !== undefined
           && this.shapeIs(sensorSplitEdge.sensorShape, "bottomSensor")) {
          return true;
        }

        edge = edge.next;
      }

      return false;
    },

    SLIP_LIMIT: 8, // max distance allowed to slip up wall
    isAtLip: function() {
      var sensorId = this.currentSideSensorTouching().sideSensorTouching;
      if(sensorId === undefined) return false;

      // sensor have no pos in world so have to approximate
      var sensorPos = {};
      if(sensorId === "leftSensor") {
        sensorPos.x = this.pos.x - 5;
      }
      else if(sensorId === "rightSensor") {
        sensorPos.x = this.pos.x + this.size.x + 5;
      }
      else {
        throw "Asking whether at lip but neither right nor left sensor in contact."
      }

      sensorPos.y = this.pos.y;
      sensorPos = ig.maths.floor(sensorPos);
      for(var i = 0; i < this.SLIP_LIMIT; i++) {
        var material = ig.leveler.solidityMap.sm[sensorPos.y - i][sensorPos.x];
        if(material === 0) {
          return true;
        }
      }

      return false;
    },

    jumping: false,
    startJump: function() {
		  this.body.ApplyForce(new b2.Vec2(0, this.getJump()), this.body.GetPosition());
      this.lastSideSensor = this.currentSideSensorTouching().sideSensorTouching;
      this.lastJumpY = this.pos.y;
      this.jumping = true;

      // fall jump tuning
      // var self = this;
      // this.showReadout = true;
      // this.last = 0;
      // setTimeout(function() {
      //   self.showReadout = false;
      // }, 200);
    },

    stopJump: function() {
      if(this.jumping === true
         && this.body.m_linearVelocity.y < 0) { // still going up
        this.body.m_linearVelocity.y = 0;
        this.jumping = false;
      }
    },

    // assumes left and right cannot be touching at the same time
    currentSideSensorTouching: function() {
      var edge = this.body.m_contactList;
      var result = { sideSensorTouching: undefined };
      while(edge !== null) {
        var sensorSplitEdge = this.sensorSplitEdge(edge);
        if(sensorSplitEdge.sensorShape !== undefined
           && this.shapeIsOneOf(sensorSplitEdge.sensorShape, ["leftSensor", "rightSensor"])) {
          result.sideSensorTouching = sensorSplitEdge.sensorShape.m_userData.id;
          result.sensorSplitEdge = sensorSplitEdge;
          return result;
        }

        edge = edge.next;
      }

      return result;
    },

    shapeIsOneOf: function(shape, sensors) {
      for(var i = 0; i < sensors.length; i++) {
        if(this.shapeIs(shape, sensors[i])) {
          return true;
        }
      }

      return false;
    },

    shapeIs: function(shape, sensor) {
      return shape.m_userData !== null && shape.m_userData.id === sensor;
    },

    getCurrentAnim: function() {
      var damageJumpAnim = "";
      return this.anims[this.direction + this.damageLevel()
                        + this.swordStatus() + damageJumpAnim];
    },

    step: function() { return this.parent(this.runForce(), this.MAX_RUN_SPEED); },

    runForce: function() {
      return this.isClinging() ? this.NORMAL_RUN_FORCE : this.NORMAL_RUN_FORCE;
    },

    stopStep: function() {
      if(this.hasFooting()) {
        this.body.m_linearVelocity.x = 0;
      }
    },

    die: function() {
      this.parent();
      this.respawn();
    },

    respawn: function() {
      ig.leveler.loadCheckpoint();
    },

    warpTo: function(pos) {
      var warpDelay = 1500;
      ig.mover.centreOn(pos, warpDelay);
      setTimeout(function() {
        // do not set x, y - handled by init()
        ig.game.player = ig.game.spawnEntity(EntityPlayer, undefined, undefined,
                                             ig.game.player.initSettings);
        ig.game.player.setup(ig.leveler);
      }, warpDelay);
    },

    getJump: function() {
      var baseForce = this.isSkewering() ? this.JUMP_FORCE_WITH_SKEWER : this.JUMP_FORCE;

      // extra boost if already falling
      var verticalMovementCompensationForce = 0;
      if(this.body.m_linearVelocity.y > 0) {
        verticalMovementCompensationForce = -this.body.m_linearVelocity.y * 150;
      }

      var finalForce = baseForce + verticalMovementCompensationForce;
      return finalForce;
    },

    receiveDamage: function(amount, from) {
      this.parent(amount, from);

      var self = this;
      clearTimeout(this.healthRegenerateTimeout);
      this.healthRegenerateTimeout = setTimeout(function() {
        self.health = self.getHealthMax();
      }, 5000);
    },

    kill: function() {
      if(this.isSkewering()) {
        this.sword.unskewer();
      }

      this.parent();
    },

    NORMAL_RUN_FORCE: 380,
    CLING_RUN_FORCE: 500,

    JUMP_FORCE: -3500,
    JUMP_FORCE_WITH_SKEWER: -6000,
    MAX_RUN_SPEED: 15
  });
});
