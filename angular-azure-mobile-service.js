'use strict';

angular.module('azure-mobile-service.module', [])
  .service('Azureservice', function Azureservice() {

	var API_URL = 'https://interview.azure-mobile.net/';
	var API_KEY = 'oovUtJxhEBFNuVIPNWlBZAfgmITnuw34';
  	var VAILD_OAUTH_PROVIDERS = ['google', 'twitter', 'facebook', 'windowsaccount', 'windowsazureactivedirectory'];

	var MobileServiceClient = WindowsAzure.MobileServiceClient;
	var client = new MobileServiceClient(API_URL, API_KEY);

  	
	var getCachedUser = function(){
		if (sessionStorage.loggedInUser)
			client.currentUser = JSON.parse(sessionStorage.loggedInUser);
	}

	getCachedUser();

	var getTable = function(tableName){
		return client.getTable(tableName);
	}

	var isUndefinedOrNotAnObjectOrFunction = function(obj){
		return typeof obj === "undefined" || (typeof obj !== 'object' && typeof obj !== 'function');
	}

	var isUndefinedOrNotAnObject = function(obj){
		return typeof obj === "undefined" || (typeof obj !== 'object');
	}

	var isNullOrUndefined = function(value){
		return value === null || typeof value === "undefined";
	}
	var isNotNullOrUndefined = function(value){
		return !isNullOrUndefined(value);
	}

	return{
		/*
			The query method will create and return an azure query.

			@param string tableName               	   REQUIRED The name of the table to query
			@param object obj 
				@param obj or function criteria		   The search object or a function to filter
														If function then it must be an OData predicate.
				@param array params		  			   Array of parameters to pass the criteria function
				@param array columns				   Array of column names to return
				@param int take 					   Number of results to return
				@param int skip						   Number of reuslts to skip over
				@param array orderBy				   Array of objects
					@param string column			   Column name to sort by
					@param string asc || desc 		   Direction to sort

     		@return promise               Returns a WindowsAzure promise
		*/
		query: function(tableName, obj){
			var data = null;

			if (tableName === undefined){
				console.error('Azureservice.query: You must specify a table name');
				return null;
			}

			if (angular.isDefined(obj) && angular.isObject(obj)){
				
	  			if (isUndefinedOrNotAnObjectOrFunction(obj.criteria))
	  				obj.criteria = {};
	  			
				data = getTable(tableName).where(obj.criteria, obj.params);

				//Number of results to return
				if (isNotNullOrUndefined(obj.take) && angular.isNumber(obj.take))
					data = data.take(obj.take);
				
				//number of results to skip
				if (isNotNullOrUndefined(obj.skip) && angular.isNumber(obj.take))
					data = data.skip(obj.skip);

	    		//How to sort/order the data
				if (angular.isDefined(obj.orderBy) && angular.isArray(obj.orderBy)){
					var orderBy = obj.orderBy;

					for (var i=0; i < orderBy.length; i++){
						var column = orderBy[i].column;
						var dir = orderBy[i].direction;

						if (angular.isDefined(column)){
							if (angular.isDefined(dir) && dir.toLowerCase() === 'desc')
								data = data.orderByDescending(column);
							else if (angular.isDefined(column))
								data = data.orderBy(column);
						}
					}
				}

	    		//Return listed columns
				if (angular.isDefined(obj.columns) && angular.isArray(obj.columns)){
					data = data.select(obj.columns.join())
				}
			
	  		}else {
	       		//No criteria specified - get everything - Note azure limits the count of returned items see docs.
	  			data = getTable(tableName).where({});
	  		}

	    	return data.includeTotalCount().read();
		},

	    /*
	      Alias to .query(tableName) 
	      Returns all results
	    */
	    getAll: function(tableName){
	      return this.query(tableName);
	    },

	    /*
	      Insert row in to Azure

	      @param string tableName       REQUIRED The name of the table to query
	      @param object obj        		REQUIRED A JSON object of data to insert into the database
	      @return promise               Returns a WindowsAzure promise
	    */

		insert: function(tableName, obj){
		if (tableName === undefined){
				console.error('Azureservice.insert: You must specify a table name');
				return null;
			}

			if (isUndefinedOrNotAnObject(obj)){
				console.error('Azureservice.insert: You must specify the insert object');
				return null;
			}  			

			return getTable(tableName).insert(obj);
		},

	    /*
	      Update row in Azure

	      @param string tableName       REQUIRED The name of the table to query
	      @param object obj        		REQUIRED A JSON object of data to update into the database
	      @return promise               Returns a WindowsAzure promise
	    */

		update: function(tableName, obj){
		if (tableName === undefined){
				console.error('Azureservice.update: You must specify a table name');
				return null;
			}

			if (isUndefinedOrNotAnObject(obj)){
				console.error('Azureservice.update: You must specify the insert object');
				return null;
			}  			

			return getTable(tableName).update(obj);
		},

	    /*
	      Delete row(s) from Azure 

	      @param string tableName       REQUIRED The name of the table to query
	      @param object obj        		REQUIRED A JSON object of data to query for deletion from the database
	      @return promise               Returns a WindowsAzure promise
	    */

		del: function(tableName, obj){
			if (tableName === undefined){
				console.error('Azureservice.del: You must specify a table name');
				return null;
			}

			if (isUndefinedOrNotAnObject(obj)){
				console.error('Azureservice.del: You must specify the insert object');
				return null;
			}  			

			return getTable(tableName).del(obj);
		},

	    /*
	      Logs a user into the oauthProvider service using Windows Azure
	      Stores the data in sessionStorage for future queries
	    
	      @param  string oauthProvider  REQUIRED pass in an oauth provider
	      @return promise               Returns a WindowsAzure promise
	    */

		login: function(oauthProvider){

			if (!angular.isDefined(oauthProvider) || VAILD_OAUTH_PROVIDERS.indexOf(oauthProvider) === -1){
				throw new Error('Azureservice.login Invalid or no oauth provider listed.')
				return null;
			}

			var promise = client.login(oauthProvider).then(function(id){
				//cache login 
 			   sessionStorage.loggedInUser = JSON.stringify(client.currentUser);	
			});
			
			return promise;
		}, 
	    /*
	      Logs a user out 
	    */

		logout: function(){
			//clear cache
			sessionStorage.loggedInUser = null;
			client.logout();
		},
		
		isLoggedIn: function(){
			return isNotNullOrUndefined(client.currentUser)  && isNotNullOrUndefined(sessionStorage.loggedInUser);
		}
	}

});
