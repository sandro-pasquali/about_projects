ig.module(
  'game.entities.dispenser'
).requires(
  'impact.entity'
).defines(function(){
  EntityDispenser = ig.Entity.extend({
	  init: function( x, y, settings ) {
      this.setChangeableSetting(settings, "width", 16);
      this.setChangeableSetting(settings, "height", 16);
      this.setChangeableSetting(settings, "entityClazz", "");
      this.gravityFactor = 0;

	    this.parent(x, y, settings);

      if(ig.editor === undefined) {
        ig.andro.setup(this);
        ig.andro.augment(this, TearDown);
        ig.andro.augment(this, Timer, { time: 1000, repeat: true });

        // dispense an instance of this.entityClazz if none
        ig.andro.augment(this, {
          setup: function(owner, eventer) {
            this.owner = owner;
            eventer.emit("timer:start");
            eventer.bind(this, "timer:elapsed", function() {
              if(this.needToDispense()) {
                this.clearOutOfViewEntities();
                ig.spawner.add(owner.entityClazz,
                               { x: owner.pos.x, y: owner.pos.y },
                               { dispensedBy: owner.id });
              }
            });
          },

          needToDispense: function() {
            if(!this.owner.isInView()) {
              return false;
            }

            var entities = ig.game.getEntitiesByType(this.owner.entityClazz);
            for(var i = 0; i < entities.length; i++) {
              if(entities[i].dispensedBy === this.owner.id
                 && (ig.maths.distance(this.owner.pos, entities[i].pos) < 200
                     || entities[i].isInView())) {
                return false;
              }
            }

            return true;
          },

          clearOutOfViewEntities: function() {
            var entities = ig.game.getEntitiesByType(this.owner.entityClazz);
            for(var i = 0; i < entities.length; i++) {
              if(entities[i].dispensedBy === this.owner.id
                 && !entities[i].isInView()) {
                entities[i].reapReady();
              }
            }
          }
        });
      }
	  }
  });
});