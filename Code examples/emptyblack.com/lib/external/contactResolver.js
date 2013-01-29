;(function() {
  function ContactResolver() {
    this.toResolve = [];
  };

  ContactResolver.prototype = {
    resolveFor: function(obj) {
      for(var i = 0; i < this.toResolve.length; i++) {
        this.toResolve[i].resolveContacts(obj);
      }
    },

    add: function(toResolve) {
      this.toResolve.push(toResolve);
    }
  };

  this.ContactResolver = ContactResolver;
}).call(this);