(function() {
  function Leveler(levelName, fromStart) {
    this.level = eval(levelName);
    this.levelName = levelName;
    ig.sessioner.put("levelName", levelName);

    this.data = this.extractLevelData();
    this.mobileEntities = [EntityHuman,
                           // EntityCrate, EntityBombBlock, EntityDoorActionBlock
                           // removed because do they really affect gameplay?
                          ];

    ig.checkpointer = new Checkpointer(levelName, fromStart);
    this.loadPreLevelModules();
    this.loadLevel();
    this.loadPostLevelModules();
    this.setupContactListener();

    this.solidityMap = this.setupSolidityMap(this.data.collisionLayers["main"]);
    this.setupEntities();
  };

  Leveler.prototype = {
	  loadLevel: function() {
	    ig.game.loadLevel(this.level);
	    for( var i = 0; i < ig.game.backgroundMaps.length; i++ ) {
		    ig.game.backgroundMaps[i].preRender = true;
	    }

	    ig.game.player = ig.game.getEntitiesByType(EntityPlayer)[0];
	  },

    loadCheckpoint: function() {
      var events = ig.checkpointer.getEvents();
      ig.checkpointer.clearEvents();
      for(var i = 0; i < events.length; i++) {
        var event = events[i];
        ig.spawner.add(event.clazz, event.pos, event.settings, event.fn);
      }

      ig.game.player.warpTo(ig.checkpointer.getLastPos());
    },

    tearDown: function() {
      for(var i = 0; i < ig.game.entities.length; i++) {
        if(ig.game.entities[i].tearDown !== undefined) {
          ig.game.entities[i].tearDown(this);
        }
      }
    },

    loadPreLevelModules: function() {
      ig.updater = new Updater();

      ig.updater.add(this);

      ig.reaper = new Reaper();
      ig.updater.add(ig.reaper);

      ig.runner = new Runner();
      ig.updater.add(ig.runner);

      ig.spawner = new Spawner();
      ig.updater.add(ig.spawner);

      ig.mover = new Mover();
      ig.updater.add(ig.mover);

      ig.amp = new Amp();
      ig.machine = new Machine();
      ig.util = new Util();
      ig.contactResolver = new ContactResolver();
    },

    update: function() {
      this.updateSolidityMap();
    },

    loadPostLevelModules: function() {},

    setupContactListener: function() {
      ig.collider.setupContactListener();
    },

    setupEntities: function() {
      for(var i = 0; i < ig.game.entities.length; i++) {
        if(ig.game.entities[i].setup !== undefined) {
          ig.game.entities[i].setup(this);
        }
      }
    },

    getMaxCoordinates: function() { return this.data.maxCoordinates; },
    getTilesize: function() { return this.data.tilesize; },

    inLevel: function(pos) {
      return pos.x >= 0 && pos.x <= this.getMaxCoordinates().x
        && pos.y >= 0 && pos.y <= this.getMaxCoordinates().y;
    },

    clearBy: function(clazz, toBeCleared) {
      var entities = ig.game.getEntitiesByType(clazz);
      for(var i = 0; i < entities.length; i++) {
        if(toBeCleared(entities[i])) {
          entities[i].reapReady();
        }
      }
    },

    extractLevelData: function() {
      var data = {};
      data.level = this.level;

      // setup max coordinates

      var maxWidth = 0;
      var maxHeight = 0;
      var tileSizeOfMax;
      for(var i in this.level.layer) {
        var layer = this.level.layer[i];
        if(layer.width > maxWidth && layer.height > maxHeight) {
          maxWidth = layer.width;
          maxHeight = layer.height;
          tileSizeOfMax = layer.tilesize;
        }
      }

      data.maxCoordinates = {
        x: (tileSizeOfMax * maxWidth) - 1,
        y: (tileSizeOfMax * maxHeight) - 1
      };

      // record tilesize

      for(var i = 0; i < this.level.layer.length; i++)
        if(this.level.layer[i].name === "collision") {
          data.tilesize = this.level.layer[i].tilesize;
          break;
        }

      // store references to collision layers
      data.collisionLayers = [];
      for(var i = 0; i < this.COLLISION_LAYER_NAMES.length; i++)
        for(var j = 0; j < this.level.layer.length; j++)
          if(this.level.layer[j].name === this.COLLISION_LAYER_NAMES[i]) {
            data.collisionLayers[this.level.layer[j].name] = this.level.layer[j];
            break;
          }

      return data;
    },

    getNextLevelName: function() {
      var levels = this.listLevels();
      for(var i = 0; i < levels.length - 1; i++) {
        if(this.levelName === levels[i]
           && window[this.levelName] !== undefined) {
          return levels[i + 1];
        }
      }

      return null;
    },

    setupSolidityMap: function(mainLayer) {
      var tilesize = this.getTilesize();
      var solidityMap = new SolidityMap(mainLayer.data[0].length * tilesize,
                                        mainLayer.data.length * tilesize);

      for(var x = 0; x < mainLayer.data[0].length; x++) {
        for(var y = 0; y < mainLayer.data.length; y++) {
          var tileMaterial = mainLayer.data[y][x];
          var material = tileMaterial < 179 && tileMaterial > 0 ? 1 : 0;
          solidityMap.updateSection({ x: x * tilesize, y: y * tilesize },
                                    tilesize, tilesize,
                                    material,
                                    false);
        }
      }

      return solidityMap;
    },

    updateSolidityMap: function() {
      for(var i = 0; i < this.mobileEntities.length; i++)
      {
        var entities = ig.game.getEntitiesByType(this.mobileEntities[i]);
        if(entities.length > 0) { // if false, probably player respawn - temporary
          this.solidityMap.clear(entities[0].material()); // clear all material for entity type
          for(var j = 0; j < entities.length; j++) {
            this.updateSolidityMapForEntity(entities[j]);
          }
        }
      }
    },

    updateSolidityMapForEntity: function(entity) {
      var entityPos = ig.maths.floor(entity.getPosition());
      if(this.inLevel(entityPos)) {
        this.solidityMap.updateSection(entityPos,
                                       entity.size.x, entity.size.y,
                                       entity.material(),
                                       true);
      }
    },

    listLevels: function() {
      return ["LevelSelect", "LevelA", "LevelB", "LevelC", "LevelD", "LevelE", "LevelF",
              "LevelG", "LevelH", "LevelI", "LevelJ", "LevelK", "LevelL", "LevelM", "LevelN",
              "LevelO", "LevelP", "LevelQ", "LevelR", "LevelS", "LevelT", "LevelU", "LevelV",
              "LevelW", "LevelX", "LevelY", "LevelZ"];
    },

    COLLISION_LAYER_NAMES: ["main", "collision"]
  };

  this.Leveler = Leveler;

  this.Leveler.loadNewLevel = function(levelName, fromStart) {
    if(ig.leveler !== undefined) { // twar down old level
      ig.leveler.tearDown();
    }

    return new Leveler(levelName, fromStart);
  };
}).call(this);
