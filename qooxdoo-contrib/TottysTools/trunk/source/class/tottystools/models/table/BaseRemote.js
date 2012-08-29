// http://manual.qooxdoo.org/1.6/pages/widget/table_remote_model.html
qx.Class.define('tottystools.models.table.BaseRemote', {
	extend: qx.ui.table.model.Remote,

	construct: function(state){
		this.base(arguments);
		this.__filters = {};
		if(state){
			this.setState(state);
		}
	},

	properties: {
		  autoRefresh: {
			init: false
		}
		, service: {
			  nullable: true
			, apply: '__afterServiceChanged'
		}
		/*
		Sort:Array
			['sex', 1, 'age', 0, 'score', 1]
			field and sort [0: desc, 1: asc]
		*/
		, sort: {
			  nullable: true
			, apply: '__afterSortChanged'
		}
	},

	events: {
		rowDataChanged: 'qx.event.type.Data'
	},

	members: {
		// begin public
		addFilter: function(field, value){
			var filters = this.__getFilters();
			filters[field] = value;
			console.log(filters);
			this.__afterFiltersChanged();
		},



		removeFilter: function(field){
			var filters = this.__getFilters();
			filters[field] = null;
			this.__afterFiltersChanged();
		},
		// end public





		// begin core
		__filters: null,



		__getFilters: function(){
			return this.__filters;
		},



		__afterServiceChanged: function(){
			if(this.getAutoRefresh()){
				this.reloadData();
			}
		},



		__afterFiltersChanged: function(){
			if(this.getAutoRefresh()){
				this.reloadData();
			}
		},



		__afterSortChanged: function(){
			if(this.getAutoRefresh()){
				this.reloadData();
			}
		},



		_loadRowCount : function(){
			var service = this.getService();
			var args = {};
			var filters = this.__getFilters();
			if(filters){
				args.filters = filters;
			}
			var RequestManager = production.RequestManager.getInstance();
			RequestManager.makeRequest(service, args, this._onRowCountCompleted, this);
		},



		_onRowCountCompleted : function(result){
			if(result === 0){
				this.fireDataEvent('rowDataChanged', []);
			}
			if (result != null){
				this._onRowCountLoaded(result);
			}
		},



		_loadRowData : function(firstRow, lastRow){
			var service = this.getService();
			var sortIndex = this.getSortColumnIndex(); // get the sortField from the column model in the table
			var sortOrder =  this.isSortAscending() ? 1 : -1;
			var args = {
				pagination: {
					  from: firstRow
					, count: false
					, limit: lastRow - firstRow
					, sort: this.getSort()
				}

			};
			var filters = this.__getFilters();
			if(filters){
				args.filters = filters;
			}
			var RequestManager = production.RequestManager.getInstance();
			RequestManager.makeRequest(service, args, this._onLoadRowDataCompleted, this);
		},



		_onLoadRowDataCompleted : function(data){
			var data = production.parsers.SubDataToDot.parse(data);
			console.log('Data loaded ' + this.getService() + ': ', this.__getFilters(), data);

			if (data != null){
				this._onRowDataLoaded(data);
			}
			this.fireDataEvent('rowDataChanged', data);
		}
		// end core
	}

});