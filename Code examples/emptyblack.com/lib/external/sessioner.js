(function() {
  function Sessioner() {};

  Sessioner.prototype = {
    put: function(id, value) {
      if(id !== undefined && value !== undefined) {
        localStorage[id] = JSON.stringify(value);
      }
      else {
        throw "Could not store undefined id or value";
      }
    },

    get: function(id) {
      if(localStorage[id] === undefined) {
        return undefined;
      }
      else {
        return JSON.parse(localStorage[id]);
      }
    }
  };

  this.Sessioner = Sessioner;
}).call(this);
