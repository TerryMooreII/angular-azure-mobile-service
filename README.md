angular-azure-mobile-service
============================

An AngularJS service for the Azure Mobile Service Client.

This support simple and complex queries, inserts, updates, deletes.  Supports login and logout of Azure authentication identies such as google, twitter, facebook, and windows live.  Also supports invoking your custom azure api calls. 


Required dependancies
-----------------------
* [AngularJS] (http://www.angularjs.com) 
* [Azure Mobile Service Client] (http://www.windowsazure.com/en-us/documentation/articles/mobile-services-html-get-started-data/)


Add the Azure Mobile Service Client to your index.html file 
```HTML
<script src='http://ajax.aspnetcdn.com/ajax/mobileservices/MobileServices.Web-1.1.2.min.js'></script>
```

After downloading the `angular-azure-mobile-service.js` to your AngularJS project then

Add `'azure-mobile-service.module'` to your main angular.module like so
```javascript
angular.module('myapp', ['myApp.controllers', 'myApp.services', 'azure-mobile-service.module']);
````

Update the API_URL and API_KEY variables located in the  `angular-azure-mobile-service.js` file with your Azure account information.


How to use
-------------
Add the Azureservice as a dependacy to your controller like so:
```javascript
angular.module('myapp')
  .controller('MainCtrl', function ($scope, Azureservice) {
  ...
})
```

This will expose the following methods

* [Azureservice.query(tableName, parameters)] (https://github.com/TerryMooreII/angular-azure-mobile-service#azureservicequerytablename-parameters)
* [Azureservice.getAll(tableName)] (https://github.com/TerryMooreII/angular-azure-mobile-service#azureservicegetalltablename)
* [Azureservice.getById(tableName, id)] (https://github.com/TerryMooreII/angular-azure-mobile-service#azureservicegetbyidtablename-id)
* [Azureservice.insert(tableName, obj)] (https://github.com/TerryMooreII/angular-azure-mobile-service#azureserviceinserttablename-obj)
* [Azureservice.update(tableName, obj)] (https://github.com/TerryMooreII/angular-azure-mobile-service#azureserviceupdatetablename-obj)
* [Azureservice.delete(tableName, obj)] (https://github.com/TerryMooreII/angular-azure-mobile-service#azureservicedeletetablename-obj)
* [Azureservice.login(oauthProvider)] (https://github.com/TerryMooreII/angular-azure-mobile-service#azureserviceloginoauthprovider)
* [Azureservice.logout()] (https://github.com/TerryMooreII/angular-azure-mobile-service#azureserviceloginoauthprovider-1)
* [Azureservice.isLoggedIn()] (https://github.com/TerryMooreII/angular-azure-mobile-service#azureserviceisloggedin)
* [Azureservice.invokeApi()] (https://github.com/TerryMooreII/angular-azure-mobile-service#azureserviceinvokeapiname-params)



Azureservice.query(tableName, parameters)
=================
Query the Azure database

Parameters:
---------------
**tableName** Required

````
The Azure table to query
```

**parameters** Optional, Javascript object used filter the query

```
{
	criteria		   //A javascript object or a function to filter
					   //If function then it must be an OData predicate.
	params		  	   //Array of parameters to pass the criteria function
	columns			   //Array of column names to return
	take 			   //Number of results to return
	skip			   //Number of reuslts to skip over
	columns			   //Array of column names to return
	orderBy			   //Array of objects
		column		   //Column name to sort by
		direction      //Direction to sort : asc || desc	
}
```
[More information] (http://www.windowsazure.com/en-us/documentation/articles/mobile-services-html-how-to-use-client-library/#querying) about what each parameter does 

Returns
-----------
AngularJS Promise

Example:
---------
Simple query to return all results from the todoListTable
Note: The empty object is optional.

```javascript
Azureservice.query('todoListTable', {})
	.then(function(items){
		//Assigin the results to a $scope variable 
		$scope.items = items;
		
	}, function(err){
		console.error('There was an error quering Azure " + err);
	})
}    

```

Query to return all items in the todoList table with a column isFinished value of false
```javascript

Azureservice.query('todoListTable', {
 	criteria: {
 			isFinished:false
 		}
 	})
	.then(function(items){
		//Assigin the results to a $scope variable 
		$scope.items = items;
		
	}, function(err){
		console.error('There was an error quering Azure " + err);
	})
}    

```

Same query as before but this time ordering the results name ascending and owner descending
```javascript
Azureservice.query('todoListTable', {
 	criteria: {
	 		isFinished:false
	 	},
	 	orderBy: [
	 		{
	 			column:'name',
	 			direction:'asc'
	 		}, 
	 		{
	 			column:'owner',
	 			direction:'desc'
	 		}
	 	]
 	})
	.then(function(items){
		//Assigin the results to a $scope variable 
		$scope.items = items;
		
	}, function(err){
		console.error('There was an error quering Azure " + err);
	})
}    
```

Same query as before but adding the pagination options of skip and take (See Azure docs) and returning just the colums name, isFinished

```javascript
Azureservice.query('todoListTable', {
 	criteria: {
	 		isFinished:false
	 	},
	 	orderBy: [
	 		{
	 			column:'name',
	 			direction:'asc'
	 		}, 
	 		{
	 			column:'owner',
	 			direction:'desc'
	 		}
	 	], 
	 	skip: 10,
	 	take: 25,
	 	columns: ['name', 'isFinished']
 	})
	.then(function(items){
		//Assigin the results to a $scope variable 
		$scope.items = items;
		
	}, function(err){
		console.error('There was an error quering Azure " + err);
	})
}    
```

For complex queries you can pass a pedicate function into the critera instead of an object, if you need to pass varibles to the function then pass add the params array.
You can still pass all the take, columns, skip parameters also but not shown here for reduce complexity

This will run the criteria function against the results passing in params array.  This will return all rows that have a column name with terry in it.  Simalar to a SQL LIKE 

```javascript
Azureservice.query('todoListTable', {
 	criteria: function(){
 			return this.name.indexOf(param[0]) !== -1;  //The this keyword is in referece to the Azure results
 		},
 	params: ['terry']
 	})
	.then(function(items){
		//Assigin the results to a $scope variable 
		$scope.items = items;
		
	}, function(err){
		console.error('There was an error quering Azure " + err);
	})
}    
```


Azureservice.insert(tableName, obj)
=================
Insert data into the Azure database

Parameters:
---------------
**tableName** Required

````
The Azure table to insert to
```

**obj** Required

```
Javascript object containing the columns and values to insert in to the database
```

Returns
-----------
AngularJS Promise


Example
-------------
```javascript
Azureservice.insert('todoListTable', {
 		name: 'This is the task',
 		owner: 'Terry Moore',
 		isFinished: false
 	})
	.then(function(){
		console.log('Insert successful');
	}, function(err){
		console.error('Azure Error: ' + err);
	})
}    
```

Returns
-----------
AngularJS Promise


Azureservice.update(tableName, obj)
=================
Query the Azure database

Parameters:
---------------
**tableName** Required

````
The Azure table to update
```

**obj** Required

```
Javascript object containing the columns and values to udpate in to the database.  Must contain Azure ID column
```

Returns
-----------
AngularJS Promise

Example
-------------
```javascript
Azureservice.update('todoListTable', {
		id: '5A25CD78-F2D9-413C-81CA-6EC090590AAF',
 		isFinished: true
 	})
	.then(function(){
		console.log('Update successful');
	}, function(err){
		console.error('Azure Error: ' + err);
	})
}    
```

Returns
-----------
AngularJS Promise


Azureservice.delete(tableName, obj)
=================
Delete from the Azure database

Parameters:
---------------
**tableName** Required

````
The Azure table to delete from
```

**obj** Required

```
Javascript object containing the criteria for rows from the database. 
```

Returns
-----------
AngularJS Promise

Example
-------------
```javascript
Azureservice.delete('todoListTable', {
		id: '5A25CD78-F2D9-413C-81CA-6EC090590AAF'
 	})
	.then(function(){
		console.log('Delete successful');
	}, function(err){
		console.error('Azure Error: ' + err);
	})
}    
```

Azureservice.getAll(tableName)
=================
Query all data from table.  
Alias to Azureservice.query(tableName, {})

Parameters:
---------------
**tableName** Required

````
The Azure table to get all data from
```

Returns
-----------
AngularJS Promise

Example
-------------
```javascript
Azureservice.getAll('todoListTable')
	.then(function(items){
		console.log('Query successful');
		$scope.item = items;
	}, function(err){
		console.error('Azure Error: ' + err);
	})
}    
```

Azureservice.getById(tableName, id)
=================
Get item from database by id

Parameters:
---------------
**tableName** Required

````
The Azure table to query from
```

**id** Required

```
The row id
```

Returns
-----------
AngularJS Promise

Example
-------------
```javascript
Azureservice.getById('todoListTable', '5A25CD78-F2D9-413C-81CA-6EC090590AAF')
	.then(function(item){
		console.log('Query successful');
		$scope.item = item;
	}, function(err){
		console.error('Azure Error: ' + err);
	})
}    
```


Azureservice.login(oauthProvider)
=================
Login using the specified Oauth Provider.
Users logins are currently session based.  This may change in the future.
[More information] (http://www.windowsazure.com/en-us/documentation/articles/mobile-services-html-how-to-use-client-library/#caching)


Parameters:
---------------
**oauthProvider** Required

````
The oauth provider
Vaild options are 'google', 'twitter', 'facebook', 'windowsaccount', 'windowsazureactivedirectory'
```

Returns
-----------
AngularJS Promise


Example
-------------
```javascript
Azureservice.login('google')
	.then(function(){
		console.log('Login successful');
	}, function(err){
		console.error('Azure Error: ' + err);
	})
}    
```


Azureservice.logout()
=================
Logs out the current user.


Parameters:
---------------

None

Returns
-----------
Undefined

Example
-------------
```javascript
Azureservice.logout();
```


Azureservice.isLoggedIn()
=================
Checks if a user is currently logged in.


Parameters:
---------------
None

Returns
-----------
True if there is a current login session 
False if there is not

Example
-------------
```javascript
Azureservice.isLoggedIn();
```


Azureservice.invokeApi(name, params)
=================
Invoke a Azure Mobile service custom api call.

[More information] (http://www.windowsazure.com/en-us/documentation/articles/mobile-services-windows-store-javascript-call-custom-api/)

If this response from the api is not a status code 200 then it trigger the error function.

Parameters:
---------------
**name** Required

````
The custom API name
```

**params** 

````
An object that contains a set of parameters to send the custom api.
If no params object is set then it will default to calling the api with a GET method.

Valid options to set in the params object:
{
	method 			//String The method to call the api with. Valid options are get, post, put, delete
	body 			//Object of key/values pairs of data to send the request body
	parameters 		//Object of key/values pairs of data to send the query parameters
	headers			//Object of key/values pairs of data to send in the reqeust headers
}
```

Returns
-----------
AngularJS Promise



Example
-------------
```javascript
Azureservice.invokeApi('apiName'{
		method: 'get',
		body: {
			...
		}
	})
	.then(function(response){
		console.log('Here is my response object');
		console.log(response)
	}, function(err){
		console.error('Azure Error: ' + err);
	})
}    
```





***For more information on Windows Azure Mobile service please refer to the*** [Microsoft Azure Mobile Service Documentation] (http://www.windowsazure.com/en-us/documentation/articles/mobile-services-html-how-to-use-client-library/)	