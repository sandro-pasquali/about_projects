;(function() {
  function Util() {};

  Util.prototype = {
    inInstances: function(obj, instances) {
      for(var i = 0; i < instances.length; i++) {
        if(obj instanceof instances[i]) {
          return true;
        }
      }

      return false;
    },

    filter: function(arr, fn) {
      var ret = [];
      for(var i = 0; i < arr.length; i++) {
        if(fn(arr[i])) {
          ret.push(arr[i]);
        }
      }

      return ret;
    },

    addAll: function(arr, items) {
      for(var i = 0; i < items.length; i++) {
        arr.push(items[i]);
      }

      return arr;
    }
  };

  this.Util = Util;
}).call(this);
