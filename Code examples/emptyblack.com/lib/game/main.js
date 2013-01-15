ig.module(
  'game.main'
).requires(
  'impact.game',
  'plugins.box2d.game',

  'game.entities.block',
  'game.entities.player',
  'game.entities.enemy',
  'game.entities.bullet',
  'game.entities.rocket',
  'game.entities.sword',
  'game.entities.crate',
  'game.entities.particle',
  'game.entities.actionBlock',
  'game.entities.edgeHint',
  'game.entities.instrument',

  // behaviour entities
  'game.entities.turretBlock',
  'game.entities.clearActionBlock',
  'game.entities.pressurePad',
  'game.entities.doorActionBlock',
  'game.entities.checkpoint',
  'game.entities.levelTransitionActionBlock',
  'game.entities.bombBlock',
  'game.entities.dispenser',
  'game.entities.sentry',

  // levels
  'game.levels.select',
  'game.levels.a','game.levels.b','game.levels.c','game.levels.d','game.levels.e',
  'game.levels.f', 'game.levels.g', 'game.levels.h', 'game.levels.i'
).defines(function(){
  MyGame = ig.Box2DGame.extend({
	  gravity: 150, // All entities are affected by this

	  clearColor: '#000000',
    player: null,

    // sounds
    bulletHitSound: new ig.Sound('media/sounds/bullethumanhit.*', true),
    gunshotSound: new ig.Sound('media/sounds/gunshot.*', true),
    swordSound: new ig.Sound('media/sounds/sword.*', true),
    g3Sound: new ig.Sound('media/sounds/g3.*', true),
    explosionSound: new ig.Sound('media/sounds/explosion.*', true),

	  init: function() {
      this.setupLockstepTiming();

      // sounds
      this.bulletHitSound.volume = 0.1;
      this.gunshotSound.volume = 0.2;
      this.swordSound.volume = 0.5;
      this.explosionSound.volume = 0.3;

	    // Bind keys
	    ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
	    ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
	    ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
      ig.input.bind(ig.KEY.SHIFT, 'walk');
	    ig.input.bind(ig.KEY.UP_ARROW, 'jump');
      ig.input.bind(ig.KEY._1, 'stab');
	    ig.input.bind(ig.KEY._2, 'shootBullet');
	    ig.input.bind(ig.KEY._3, 'shootRocket');
	    // ig.input.bind(ig.KEY.T, 'opendoors');
	    // ig.input.bind(ig.KEY.D, 'die');
	    // ig.input.bind(ig.KEY.C, 'checkpoint');

      this.loadNonLevelSpecificModules();

      var levelName = "LevelA";
      if(ig.sessioner.get("levelName") !== undefined) {
        levelName = ig.sessioner.get("levelName");
      }
      ig.leveler = Leveler.loadNewLevel(levelName, false);
	  },

    // sets time to always proceed in increments of the same amount
    // - should solve problems with variable framerate and vectors meaning objs in Box2D go
    // mental during framerate changes
    // taken from this thread: http://impactjs.com/forums/help/deterministic-game-loop
    setupLockstepTiming: function() {
      ig.Timer.inject({
        tick: function() {
          return 0.016666667;
        }
      });
    },

    loadNonLevelSpecificModules: function() {
      ig.sounder = new Sounder();
      ig.maths = new Maths();
      ig.collider = new Collider();
      ig.sessioner = new Sessioner();

      ig.andro = new Andro();
      window.Behaviours = {};
    },

	  update: function() {
	    this.parent(); // update all entities and BackgroundMaps
      ig.updater.update();
	  },

	  draw: function() {
	    this.parent(); // draw all entities and BackgroundMaps
      //this.debugDrawer.draw();
	  }
  });

	ig.main('#canvas', MyGame, 60, 1500, 800, 1);
});
