ig.module(
  'game.entities.clearActionBlock'
).requires(
  'plugins.box2d.entity',
  'game.entities.actionBlock'
).defines(function(){
  EntityClearActionBlock = EntityActionBlock.extend({

	  init: function( x, y, settings ) {
      this.setChangeableSetting(settings, "width", 32);
      this.setChangeableSetting(settings, "height", 32);
      this.setChangeableSetting(settings, "color", "blue");

      settings.behaviour1 = "TouchCount";
      settings.behaviour2 = "ClearColorOnTouch";

	    this.parent(x, y, settings);
	  }
  });
});