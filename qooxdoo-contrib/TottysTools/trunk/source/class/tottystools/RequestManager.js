qx.Class.define('tottystools.RequestManager', {
	extend: qx.ui.container.Composite,
	type: 'singleton',

	properties: {
		database: {
			init: null
		}
	},

	members: {
		requests: [],

		makeRequest: function(service, args, callback, context){
			var url  = "http://localhost:3000/rpc";
			var req = new qx.io.remote.Request(url, "POST");
			var data = qx.lang.Json.stringify([{"service": service, "args": args, "db": this.getDatabase()}]);

			req.setMethod("POST");
			req.setRequestHeader("Content-Type", "application/json");
			req.setTimeout(1000000);
			req.setData(data);

			req.addListener("completed", function(response){
				var result = response.getContent();
				result = qx.lang.Json.parse(result)[0];
				callback.call(context, result);
			}, this);
			req.send();
		}
			
			
	}

});

