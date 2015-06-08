angular-azure-mobile-service
============================

An AngularJS service for the Azure Mobile Service Client.

This supports simple and complex queries, inserts, updates, and deletes.  Supports login and logout of Azure authentication identities such as Google, Twitter, Facebook, Windows Live, and Azure Active Directory.  Also supports invoking your custom azure api calls. 

Installation
-------------
```
bower install angular-azure-mobile-service
```
```
npm install angular-azure-mobile-service
```

CDN
------
```HTML
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular-azure-mobile-service/1.3.6/angular-azure-mobile-service.min.js"></script>
```
Check for latest published CDN version [here] (https://cdnjs.com/libraries/angular-azure-mobile-service)


Required dependancies
-----------------------
* [AngularJS] (http://www.angularjs.org) 
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

API Key information **New in 1.1**
-------------------
Create an AngularJS `constant` service called `AzureMobileServiceClient`, this will provide the Azure Mobile service with the API Key and URL and will not get overwritten with bower updates.

If you want to store the current user in localStorage instead of sessionStorage then add `STORAGE: 'local'` to the AzureMobileServiceClient settings object.

```javascript
 angular.module('your-module-name').constant('AzureMobileServiceClient', {
    API_URL : 'https://<your-api-url>.azure-mobile.net/',
    API_KEY : '<your-api-key>',
  });

```


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

* [Azureservice.query(tableName, parameters, withFilterFn)] (#azureservicequerytablename-parameters-withfilterfn)
* [Azureservice.insert(tableName, obj, withFilterFn)] (#azureserviceinserttablename-obj-withfilterfn)
* [Azureservice.update(tableName, obj, withFilterFn)] (#azureserviceupdatetablename-obj-withfilterfn)
* [Azureservice.del(tableName, obj, withFilterFn)] (#azureservicedeltablename-obj-withfilterfn)
* [Azureservice.getAll(tableName, withFilterFn)] (#azureservicegetalltablename-withfilterfn)
* [Azureservice.getById(tableName, id, withFilterFn)] (#azureservicegetbyidtablename-id-withfilterfn)
* [Azureservice.read(tableName, parameters, withFilterFn)] (#azureservicereadtablename-parameters-withfilterfn)
* [Azureservice.login(oauthProvider)] (#azureserviceloginoauthprovider)
* [Azureservice.logout()] (#azureservicelogout)
* [Azureservice.setCurrentUser(userObj)] (#azureservicesetcurrentuseruserobj)
* [Azureservice.getCurrentUser()] (#azureservicegetcurrentuser)
* [Azureservice.isLoggedIn()] (#azureserviceisloggedin)
* [Azureservice.invokeApi()] (#azureserviceinvokeapiname-params)



Azureservice.query(tableName, parameters, withFilterFn)
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


**withFilterFn** Optional [More information] (http://azure.microsoft.com/en-us/documentation/articles/mobile-services-html-how-to-use-client-library/#customizing)

````
A function that can read and write arbitrary properties or add additional headers to the request 
```

Returns
-----------
AngularJS Promise

Example:
---------
Simple query to return all results from the todoListTable
Note: The empty object is optional.

```javascript
Azureservice.query('todoListTable', {})
	.then(function(items) {
		// Assigin the results to a $scope variable 
		$scope.items = items;
		
	}, function(err) {
		console.error('There was an error quering Azure ' + err);
	});

```

Query to return all items in the todoList table with a column isFinished value of false
```javascript

Azureservice.query('todoListTable', {
 	criteria: {
 			isFinished:false
 		}
 	})
	.then(function(items) {
		// Assigin the results to a $scope variable 
		$scope.items = items;
		
	}, function(err) {
		console.error('There was an error quering Azure ' + err);
	});

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
	.then(function(items) {
		// Assigin the results to a $scope variable 
		$scope.items = items;
		
	}, function(err) {
		console.error('There was an error quering Azure ' + err);
	});
    
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
	.then(function(items) {
		// Assigin the results to a $scope variable 
		$scope.items = items;
		
	}, function(err) {
		console.error('There was an error quering Azure ' + err);
	});
    
```

For complex queries you can pass a pedicate function into the critera instead of an object, if you need to pass varibles to the function then pass add the params array.
You can still pass all the take, columns, skip parameters also but not shown here for reduce complexity

This will run the criteria function against the results passing in params array.  This will return all rows that have a column name with terry in it.  Simalar to a SQL LIKE 

```javascript
Azureservice.query('todoListTable', {
 	criteria: function() {
 			return this.name.indexOf(param[0]) !== -1;  // The this keyword is in referece to the Azure results
 		},
 	params: ['terry']
 	})
	.then(function(items) {
		// Assigin the results to a $scope variable 
		$scope.items = items;
		
	}, function(err) {
		console.error('There was an error quering Azure ' + err);
	});
    
```


Azureservice.insert(tableName, obj, withFilterFn)
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

**withFilterFn** Optional [More information] (http://azure.microsoft.com/en-us/documentation/articles/mobile-services-html-how-to-use-client-library/#customizing)

````
A function that can read and write arbitrary properties or add additional headers to the request 
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
	.then(function() { 
		console.log('Insert successful');
	}, function(err) {
		console.error('Azure Error: ' + err);
	});
    
```


Azureservice.update(tableName, obj, withFilterFn)
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

**withFilterFn** Optional [More information] (http://azure.microsoft.com/en-us/documentation/articles/mobile-services-html-how-to-use-client-library/#customizing)

````
A function that can read and write arbitrary properties or add additional headers to the request 
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
	.then(function() {
		console.log('Update successful');
	}, function(err) {
		console.error('Azure Error: ' + err);
	});
    
```

Returns
-----------
AngularJS Promise


Azureservice.del(tableName, obj, withFilterFn)
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


**withFilterFn** Optional [More information] (http://azure.microsoft.com/en-us/documentation/articles/mobile-services-html-how-to-use-client-library/#customizing)

````
A function that can read and write arbitrary properties or add additional headers to the request 
```

Returns
-----------
AngularJS Promise

Example
-------------
```javascript
Azureservice.del('todoListTable', {
		id: '5A25CD78-F2D9-413C-81CA-6EC090590AAF'
 	})
	.then(function() {
		console.log('Delete successful');
	}, function(err) {
		console.error('Azure Error: ' + err);
	});
    
```

Azureservice.getAll(tableName, withFilterFn)
=================
Query all data from table.  
Alias to Azureservice.query(tableName, {})

Parameters:
---------------
**tableName** Required

````
The Azure table to get all data from
```


**withFilterFn** Optional [More information] (http://azure.microsoft.com/en-us/documentation/articles/mobile-services-html-how-to-use-client-library/#customizing)

````
A function that can read and write arbitrary properties or add additional headers to the request  
```

Returns
-----------
AngularJS Promise

Example
-------------
```javascript
Azureservice.getAll('todoListTable')
	.then(function(items) {
		console.log('Query successful');
		$scope.item = items;
	}, function(err) {
		console.error('Azure Error: ' + err);
	});
    
```

Azureservice.getById(tableName, id, withFilterFn)
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


**withFilterFn** Optional [More information] (http://azure.microsoft.com/en-us/documentation/articles/mobile-services-html-how-to-use-client-library/#customizing)

````
A function that can read and write arbitrary properties or add additional headers to the request  
```

Returns
-----------
AngularJS Promise

Example
-------------
```javascript
Azureservice.getById('todoListTable', '5A25CD78-F2D9-413C-81CA-6EC090590AAF')
	.then(function(item) {
		console.log('Query successful');
		$scope.item = item;
	}, function(err) {
		console.error('Azure Error: ' + err);
	});
    
```

Azureservice.read(tableName, parameters, withFilterFn)
=================
Execute read-query in Azure with optional parameters in the URI that can be read by the Azure JS backend (request.parameters.property).

Parameters:
---------------
**tableName** Required

````
The Azure table to get all data from
```

**parameters** Optional
````
An object of user-defined parameters and values to include in the request URI query string
Or as a string to pass an oData query filter. 
````

**withFilterFn** Optional [More information] (http://azure.microsoft.com/en-us/documentation/articles/mobile-services-html-how-to-use-client-library/#customizing)

````
A function that can read and write arbitrary properties or add additional headers to the request  
```

Returns
-----------
AngularJS Promise

Example with parameters object
-------------
```javascript
Azureservice.read('todoListTable',{
	apiVersion: "1.0",
	isCompleted: true
	})
	.then(function(items) {
		console.log('Query successful');
		$scope.item = items;
	}, function(err) {
		console.error('Azure Error: ' + err);
	});
    
```

Example with parameters as an oData filter string
-------------
```javascript
Azureservice.read('todoListTable', "$filter=name eq 'Test User'")
	.then(function(items) {
	    console.log(items)
	}).catch(function(error) {
	    console.log(error)
	})
    
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
Vaild options are 'google', 'twitter', 'facebook', 'microsoftaccount', 'aad'
```

Returns
-----------
AngularJS Promise


Example
-------------
```javascript
Azureservice.login('google')
	.then(function() {
		console.log('Login successful');
	}, function(err) {
		console.error('Azure Error: ' + err);
	});
    
```




Azureservice.setCurrentUser(userObj)
=================
Use this method to set the current user for the MS Client when using custom authentication. 
[More information] (http://azure.microsoft.com/en-us/documentation/articles/mobile-services-dotnet-backend-get-started-custom-authentication/)


Parameters:
---------------
**userObj** Required

````
The user object that is returned from your custom authentication.
```

Returns
-----------



Example
-------------
```javascript
Azureservice.setCurrentUser(userObj);
```



Azureservice.getCurrentUser()
=================
Use this method to get the current user object from the MS Client.


Parameters:
---------------

None

Returns
-----------

The user object that is logged in with Azure authentication, or null if none is logged in.



Example
-------------
```javascript
Azureservice.getCurrentUser();
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
Azureservice.invokeApi('apiName' {
		method: 'get',
		body: {
			...
		}
	})
	.then(function(response) {
		console.log('Here is my response object');
		console.log(response)
	}, function(err) {
		console.error('Azure Error: ' + err);
	});
    
```





***For more information on Windows Azure Mobile service please refer to the*** [Microsoft Azure Mobile Service Documentation] (http://www.windowsazure.com/en-us/documentation/articles/mobile-services-html-how-to-use-client-library/)	
