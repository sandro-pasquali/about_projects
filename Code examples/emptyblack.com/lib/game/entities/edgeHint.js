ig.module(
  'game.entities.edgeHint'
).requires(
  'game.entities.hint'
).defines(function(){

  EntityEdgeHint = EntityHint.extend({
	animSheet: new ig.AnimationSheet('media/edgehint.png', 1, 8),

	init: function( x, y, settings ) {
	  this.addAnim('idle', 1, [0]);
	  this.parent(x, y, settings);
	}
  });
});