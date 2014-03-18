angular-azure-mobile-service
============================

An AngularJS service for the Azure Mobile Service Client.

This support simple and complex queries, inserts, updates, deletes, and login/logout.

The login function currently stores the authentication token in the sessionStorage and will required users to reauthenticate if they close the page.  This may get updated to use the angular $cookiestore in the future. 


Required dependancies
-----------------------
* [AngularJS] (http://www.angularjs.com) 
* [Azure Mobile Service Client] (http://www.windowsazure.com/en-us/documentation/articles/mobile-services-html-get-started-data/)


Install each dependancy to your AngularJS project.

Add the Azure Mobile Service Client to your main index.html file 
```HTML
<script src='http://ajax.aspnetcdn.com/ajax/mobileservices/MobileServices.Web-1.1.2.min.js'></script>
```

After downloading the angular-azure-mobileservice to your AngularJS project then

Add `'azure-mobile-service.module'` to your main angular.module like so
```javascript
angular.module('myapp', ['myApp.controllers', 'myApp.services', 'azure-mobile-service.module']);
````

Update the API_URL and API_KEY which is located in the `angular-azure-mobile-service.js` file with your Azure account information.


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

* [Azureservice.query(tableName, parameters)] (https://github.com/TerryMooreII/angular-azure-mobile-service#-azureservicequerytablename-parameters)
* [Azureservice.getAll(tableName)] (https://github.com/TerryMooreII/angular-azure-mobile-service#azureservicegetalltablename)
* [Azureservice.insert(tableName, obj)] (https://github.com/TerryMooreII/angular-azure-mobile-service#azureserviceinserttablename-obj)
* [Azureservice.update(tableName, obj)] (https://github.com/TerryMooreII/angular-azure-mobile-service#azureserviceupdatetablename-obj)
* [Azureservice.delete(tableName, obj)] (https://github.com/TerryMooreII/angular-azure-mobile-service#azureservicedeletetablename-obj)
* [Azureservice.login(oauthProvider)] (https://github.com/TerryMooreII/angular-azure-mobile-service#azureserviceloginoauthprovider)
* [Azureservice.logout()] (https://github.com/TerryMooreII/angular-azure-mobile-service#azureserviceloginoauthprovider-1)
* [Azureservice.isLoggedIn()] (https://github.com/TerryMooreII/angular-azure-mobile-service#azureserviceisloggedin)



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
Windows Azure Promise [See] (http://www.windowsazure.com/en-us/documentation/articles/mobile-services-html-how-to-use-client-library/#promises)

Example:
---------
Simple query to return all results from the todoListTable
Note: The empty object is optional.

```javascript
Azureservice.query('todoListTable', {})
	.done(function(items){
		//Assigin the results to a $scope variable 
		$scope.items = items;
		$scope.$apply();  //IMPORTANT!!!! Because the response function is outside of $scope we have to do a $scope.apply to let Angular know that we have updated a scope variable
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
	.done(function(items){
		//Assigin the results to a $scope variable 
		$scope.items = items;
		$scope.$apply();  //IMPORTANT!!!! Because the response function is outside of $scope we have to do a $scope.apply to let Angular know that we have updated a scope variable
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
	.done(function(items){
		//Assigin the results to a $scope variable 
		$scope.items = items;
		$scope.$apply();  //IMPORTANT!!!! Because the response function is outside of $scope we have to do a $scope.apply to let Angular know that we have updated a scope variable
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
	.done(function(items){
		//Assigin the results to a $scope variable 
		$scope.items = items;
		$scope.$apply();  //IMPORTANT!!!! Because the response function is outside of $scope we have to do a $scope.apply to let Angular know that we have updated a scope variable
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
	.done(function(items){
		//Assigin the results to a $scope variable 
		$scope.items = items;
		$scope.$apply();  //IMPORTANT!!!! Because the response function is outside of $scope we have to do a $scope.apply to let Angular know that we have updated a scope variable
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
Windows Azure Promise [See] (http://www.windowsazure.com/en-us/documentation/articles/mobile-services-html-how-to-use-client-library/#promises)


Example
-------------
```javascript
Azureservice.insert('todoListTable', {
 		name: 'This is the task',
 		owner: 'Terry Moore',
 		isFinished: false
 	})
	.done(function(){
		console.log('Insert successful');
	}, function(err){
		console.error('Azure Error: ' + err);
	})
}    
```

Returns
-----------
Windows Azure Promise [See] (http://www.windowsazure.com/en-us/documentation/articles/mobile-services-html-how-to-use-client-library/#promises)


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
Windows Azure Promise [See] (http://www.windowsazure.com/en-us/documentation/articles/mobile-services-html-how-to-use-client-library/#promises)

Example
-------------
```javascript
Azureservice.update('todoListTable', {
		id: '5A25CD78-F2D9-413C-81CA-6EC090590AAF',
 		isFinished: true
 	})
	.done(function(){
		console.log('Update successful');
	}, function(err){
		console.error('Azure Error: ' + err);
	})
}    
```

Returns
-----------
Windows Azure Promise [See] (http://www.windowsazure.com/en-us/documentation/articles/mobile-services-html-how-to-use-client-library/#promises)


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
Windows Azure Promise [See] (http://www.windowsazure.com/en-us/documentation/articles/mobile-services-html-how-to-use-client-library/#promises)

Example
-------------
```javascript
Azureservice.delete('todoListTable', {
		id: '5A25CD78-F2D9-413C-81CA-6EC090590AAF'
 	})
	.done(function(){
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
The Azure table to delete from
```

Returns
-----------
Windows Azure Promise [See] (http://www.windowsazure.com/en-us/documentation/articles/mobile-services-html-how-to-use-client-library/#promises)

Example
-------------
```javascript
Azureservice.getAll('todoListTable')
	.done(function(items){
		console.log('Query successful');
		$scope.item = items;
		$scope.apply(); //Important
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
Windows Azure Promise [See] (http://www.windowsazure.com/en-us/documentation/articles/mobile-services-html-how-to-use-client-library/#promises)


Example
-------------
```javascript
Azureservice.login('google')
	.done(function(){
		console.log('Login successful');
	}, function(err){
		console.error('Azure Error: ' + err);
	})
}    
```


Azureservice.login(oauthProvider)
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


For more information see the Microsoft Azure Mobile Service Documentation

[More information] (http://www.windowsazure.com/en-us/documentation/articles/mobile-services-html-how-to-use-client-library/)