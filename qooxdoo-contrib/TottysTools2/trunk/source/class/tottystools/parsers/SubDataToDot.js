// http://manual.qooxdoo.org/1.6/pages/widget/table_remote_model.html
qx.Class.define('tottystools.parsers.SubDataToDot', {
	extend: qx.core.Object,
	type: 'singleton',

	construct: function(){
		this.base(arguments);
	},

	properties: {
	},

	events: {
	},

	statics: {
		parse: function(data, args){
			var i = data.length;
			var item;
			var key;
			var subItem;
			var subKey;
			var defaultArgs = {
				maintainObject: true
			}
			args = qx.lang.Object.merge(args ? args : {}, defaultArgs);

			// for each item
			while(i--){
				item = data[i];
				// for each key in the item
				for(key in item){
					var subItem =  item[key]
					// if the value is an object
					if(qx.lang.Type.isObject(subItem)){
						// for each key in the sub item
						for(subKey in subItem){
							// in the main item add the key.subKey value
							item[key+'.'+subKey] = subItem[subKey];
						}
					}
					// ['a', 2, 'xxx', true]
					// will be converted to
					// 'a 2 xxx true'
					// we will change the toString method
					if(qx.lang.Type.isArray(subItem)){
						var string = '';
						subItem.forEach(function(value, index, array){
							string += production.parsers.SubDataToDot.__parse(value) + ', '
						})
						subItem.toString = function(){
							return string;
						}
					}
					if(!args.maintainObject){
						delete item[key];
					}
				}
			}

			return data;
		}


		,__parse: function(data){
			if(qx.lang.Type.isObject(data)){
				var string = '';
				for(key in data){
					// in the main item add the key.subkey value
					string += key + ':' + production.parsers.SubDataToDot.__parse(data[key]) + ', ';
				}
				data.toString = function(){
					return string;
				}
			}
			else if(qx.lang.Type.isArray(data)){
				var string = '';
				data.forEach(function(value, index, array){
					string += production.parsers.SubDataToDot.__parse(value) + ', '
				})
				data.toString = function(){
					return string;
				}
			}
			else{
			}
			return data;
		}
	}

});