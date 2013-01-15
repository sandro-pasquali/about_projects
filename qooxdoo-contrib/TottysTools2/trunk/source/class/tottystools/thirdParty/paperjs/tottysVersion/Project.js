/*
Every item added on the screen must reference a instance of this if
they want to be displayed on the screen and have it's mouse events
dispatched.
*/

qx.Class.define('tottystools.thirdParty.paperjs.tottysVersion.Project', {
	extend: qx.core.Object

	,properties: {

	}

	,construct: function(){
		this.base(arguments);
		var paper = this.__paper = tottystools.thirdParty.paperjs.Paper.paper();
		this.__eventManager = new tottystools.thirdParty.paperjs.tottysVersion.EventManager(paper);
		this.__items = new qx.data.Array();
	}

	,members: {
		// begin public
		addChild: function(item){
			this.__items.push(item);
			this.__addItemToPaperJs(item.getGraphic());
			this.__addItemToEventManager(item);
		}
		// end public





		// begin apply
		// end apply





		// begin handlers
		// end handlers





		// begin core
		,__addGraphicToPaperJs: function(graphic){
			this.__paper.project.activeLayer.addChild(graphic);
		}



		,__addItemToEventManager: function(item){
			this.__eventManager.addItem(item);
		}
		// end core





		// begin booleans
		// end booleans
	}

});