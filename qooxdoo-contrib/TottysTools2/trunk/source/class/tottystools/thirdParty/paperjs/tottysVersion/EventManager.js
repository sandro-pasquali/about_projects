qx.Class.define('tottystools.thirdParty.paperjs.tottysVersion.EventManager', {
	extend: qx.core.Object

	,properties: {

	}

	,construct: function(paper){
		this.__items = {
			mousedown: new qx.data.Array()
		};
		
		var tool = new paper.Tool();
		tool.activate();
		tool.distanceThreshold = 1;

		tool.onMouseDown = function(e){
			var hitResult = paper.project.hitTest(e.point);
			if(hitResult !== null && hitResult.item !== null && hitResult.item === graphic){
				that.fireDataEvent('mousedown', e);
			}
		};
	}

	,members: {
		// begin public
		addItem: function(item, eventType){
			var array = this.__items[eventType];
			if(array.contains(item)){
				throw new Error('The item is already added.');
				return false;
			}
			array.push(item);
			return true;
		}



		,removeItem: function(item, eventType){
			var array = this.__items[eventType];
			if(!array.contains(item)){
				throw new Error('The item has not been added.');
				return false;
			}
			array.remove(item);
			return false;
		}



		,addListener: function(item, eventType, callback, context){
			this.addItem(item, eventType);
		}
		// end public





		// begin apply
		// end apply





		// begin handlers
		// end handlers





		// begin core
		// end core





		// begin booleans
		// end booleans
	}

});