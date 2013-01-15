;(function() {
  function Checkpointer(levelName, fromStart) {
    this.levelName = levelName;
    this.clearEvents();

    if(fromStart === false
       && ig.sessioner.get(this.levelCheckpointId()) !== undefined) {
      this.tag(ig.sessioner.get(this.levelCheckpointId()))
    }
  };

  Checkpointer.prototype = {
    tag: function(pos) {
      this.lastPos = pos;
      ig.sessioner.put(this.levelCheckpointId(), pos);
    },

    // not persisted
    event: function(data) {
      this.events.push(data);
    },

    getEvents: function() {
      return this.events;
    },

    clearEvents: function() {
      this.events = [];
    },

    getLastPos: function() {
      return this.lastPos;
    },

    levelCheckpointId: function() {
      return this.levelName + "checkpoint";
    }
  };

  this.Checkpointer = Checkpointer;
}).call(this);