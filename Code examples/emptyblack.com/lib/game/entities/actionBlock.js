ig.module(
  'game.entities.actionBlock'
).requires(
  'plugins.box2d.entity',
  'game.entities.block'
).defines(function(){
  EntityActionBlock = EntityBlock.extend({
    size: {x: 8, y: 8 },

	  init: function(x, y, settings) {
	    this.parent(x, y, settings);
      this.setupBehaviour(settings);
	  },

    setAnim: function(name) {
      var potentialAnim = this.anims[name];
      if(potentialAnim !== null && this.currentAnim != potentialAnim) {
        this.currentAnim = potentialAnim;
      }

      return this.currentAnim;
    },

    NUM_SLOTS: 18,
    FLASH_FRAMES_START: 8,
    FLASH_NUM_PLAYING_FRAMES: 5,
    THROB_FRAMES_START: 1,
    THROB_NUM_PLAYING_FRAMES: 15,
    LOW: 4,
    ARM: 6,
    ON_FULL: 8,
    addAnims: function() {
      this.animSheet = new ig.AnimationSheet('media/actionBlock'
                                             + this.size.x + 'x' + this.size.y + '.png',
                                             this.size.x, this.size.y);

      for(var i = 0; i < ig.maths.COLORS.length; i++) {
        var color = ig.maths.COLORS[i];
        this.addAnim(color + "idle", 1, [i * this.NUM_SLOTS]);
        this.addAnim(color + "low", 1, [this.LOW + (i * this.NUM_SLOTS)]);
        this.addAnim(color + "arm", 1, [this.ARM + (i * this.NUM_SLOTS)]);
        this.addAnim(color + "on_full", 1, [this.ON_FULL + (i * this.NUM_SLOTS)]);

        // flash
        var frames = [];
        var frameBase = this.FLASH_FRAMES_START + (i * this.NUM_SLOTS);
        for(var j = frameBase; j < frameBase + this.FLASH_NUM_PLAYING_FRAMES; j++) {
          frames.push(j);
        }
        this.addAnim(color + "flash", 0.05, frames, true);

        // throb
        frames = [];
        var frameBase = this.THROB_FRAMES_START + (i * this.NUM_SLOTS);
        for(var j = frameBase; j < frameBase + this.THROB_NUM_PLAYING_FRAMES; j++) {
          frames.push(j);
        }
        this.addAnim(color + "throb", 0.05, frames, false);
      }
    }
  });
});
