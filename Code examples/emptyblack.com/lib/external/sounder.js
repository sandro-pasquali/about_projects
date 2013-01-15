;(function() {
  function Sounder() {
    this.lastPlayed = {};
  };

  Sounder.prototype = {
    play: function(soundName) {
      if(this.lastPlayed[soundName] === undefined
         || ig.maths.timePassed(this.lastPlayed[soundName], 130)) {
        ig.game[soundName].play();
        this.lastPlayed[soundName] = new Date().getTime();
      }
    }
  };

  this.Sounder = Sounder;
}).call(this);
