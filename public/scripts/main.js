angular.module("gigPlanner",["ngResource","ui.router","templates"]),angular.module("gigPlanner").constant("AuthEvents",{logout:"auth-logout"}),angular.module("gigPlanner").config(["$httpProvider",function(n){n.interceptors.push("authInterceptor")}]),angular.module("gigPlanner").run(["$rootScope","Account","AuthEvents","api","$state",function(n,e,a,l,r){l.setToken(),e.init(),n.$on(a.logout,e.logout),n.$on("$stateChangeStart",function(n,a){a.data&&a.data.auth&&(e.isLoggedIn()||(n.preventDefault(),r.go("login")))})}]),angular.module("gigPlanner").config(["$stateProvider","$urlRouterProvider",function(n,e){e.otherwise("/dashboard"),n.state("dashboard",{url:"/dashboard",controller:"DashboardController",templateUrl:"views/dashboard.html"}).state("login",{url:"/login",controller:"LoginController",templateUrl:"views/login.html"}).state("signup",{url:"/signup",controller:"SignupController",templateUrl:"views/signup.html"}).state("users",{url:"/users",controller:"UserController",templateUrl:"views/users.html",data:{auth:!0}}).state("user",{url:"/users/:id",controller:"UserDetailController",templateUrl:"views/user.html",data:{auth:!0}}).state("bands",{url:"/bands",controller:"BandController",templateUrl:"views/bands.html",data:{auth:!0}}).state("band",{url:"/bands/:id",controller:"BandDetailController",templateUrl:"views/band.html",data:{auth:!0}}).state("events",{url:"/events",controller:"EventController",templateUrl:"views/events.html",data:{auth:!0}}).state("event",{url:"/events/:id",controller:"EventDetailController",templateUrl:"views/event.html",data:{auth:!0}})}]),angular.module("templates",[]).run(["$templateCache",function(n){n.put("views/band.html",'<ol class="breadcrumb">\n    <li><a ui-sref="dashboard">Home</a></li>\n    <li><a ui-sref="bands">Bands</a></li>\n    <li class="active">{{ band.name }}</li>\n</ol>\n\n\n<h1>{{ band.name }}</h1>\n\n<form class="form-horizontal" name="editBandForm" ng-submit="band.$update()">\n    <div class="form-group">\n        <label for="name" class="col-sm-2">Naam</label>\n        <div class="col-sm-10">\n            <input type="text" ng-model="band.name" class="form-control" id="name" placeholder="Guns n Roses" required>\n        </div>\n    </div>\n    <button type="submit" ng-disabled="editBandForm.$invalid">Save</button>\n</form>\n'),n.put("views/bands.html",'<ol class="breadcrumb">\n    <li><a ui-sref="dashboard">Home</a></li>\n    <li class="active">Bands</li>\n</ol>\n\n<h1>Bands</h1>\n\n<form class="form-inline" ng-submit="addBand(newBand)" name="addBandForm">\n    <div class="form-group">\n        <label for="name">Naam</label>\n        <input type="text" ng-model="newBand.name" class="form-control" id="name" placeholder="Guns n Roses" required>\n    </div>\n    <button type="submit" ng-disabled="addBandForm.$invalid">Add Band</button>\n</form>\n<br/>\n\n<table class="table table-striped table-hover">\n    <tr>\n        <th>Naam</th>\n        <th>Verwijder</th>\n    </tr>\n    <tr ng-repeat="band in bands">\n        <td><a ui-sref="band({id:band._id})">{{ band.name }}</a></td>\n\n        <td><button ng-click="deleteBand(band)">Delete</button></td>\n    </tr>\n</table>'),n.put("views/dashboard.html","<h1>Welkom</h1>\n<p>GigPlanner is een work in progress.</p>"),n.put("views/event.html",'<ol class="breadcrumb">\n    <li><a ui-sref="dashboard">Home</a></li>\n    <li><a ui-sref="events">Events</a></li>\n    <li class="active">{{ event.name }}</li>\n</ol>\n\n\n<h1>{{ event.name }}</h1>\n\n<form class="form-horizontal" name="editEventForm" ng-submit="event.$update()">\n    <div class="form-group">\n        <label for="name" class="col-sm-2">Naam</label>\n        <div class="col-sm-10">\n            <input type="text" ng-model="event.name" class="form-control" id="name" placeholder="Lowlands" required>\n        </div>\n    </div>\n    <div class="form-group">\n        <label for="date" class="col-sm-2">Datum</label>\n        <div class="col-sm-10">\n            <input type="date" ng-model="event.date" class="form-control" id="date" required>\n        </div>\n    </div>\n    <button type="submit" ng-disabled="editEventForm.$invalid">Save</button>\n</form>\n'),n.put("views/events.html",'<ol class="breadcrumb">\n    <li><a ui-sref="dashboard">Home</a></li>\n    <li class="active">Events</li>\n</ol>\n\n<h1>Events</h1>\n\n<form class="form-inline" ng-submit="addEvent(newEvent)" name="addEventForm">\n    <div class="form-group">\n        <label for="name">Naam</label>\n        <input type="text" ng-model="newEvent.name" class="form-control" id="name" placeholder="The Big Event" required>\n    </div>\n    <div class="form-group">\n        <label for="date">Datum</label>\n        <input type="date" ng-model="newEvent.date" class="form-control" id="date" required>\n    </div>\n    <button type="submit" ng-disabled="addEventForm.$invalid">Add Event</button>\n</form>\n<br/>\n\n<table class="table table-striped table-hover">\n    <tr>\n        <th>Naam</th>\n        <th>Datum</th>\n        <th>Verwijder</th>\n    </tr>\n    <tr ng-repeat="event in events">\n        <td><a ui-sref="event({id:event._id})">{{ event.name }}</a></td>\n        <td>{{ event.date | date:\'d MMMM yyyy\' }}</td>\n        <td><button ng-click="deleteEvent(event)">Delete</button></td>\n    </tr>\n</table>'),n.put("views/login.html",'<h2>Login with: </h2>\n<ul>\n    <li><a href="http://localhost:8080/auth/facebook">Facebook</a></li>\n</ul>\n\n<h2>Login locally: </h2>\n\n<form ng-submit="login()" class="form-horizontal" name="loginForm">\n    <div class="form-group">\n        <label for="username" class="col-sm-2">Email:</label>\n        <div class="col-sm-10">\n            <input type="email" id="username" ng-model="user.username" class="form-control">\n        </div>\n    </div>\n    <div class="form-group">\n        <label for="password" class="col-sm-2">Password:</label>\n        <div class="col-sm-10">\n            <input type="password" id="password" ng-model="user.password" class="form-control">\n        </div>\n    </div>\n    <input type="submit" value="Login">\n</form>\n<hr />\n<a ui-sref="signup">Or signup here</a>\n\n'),n.put("views/signup.html",'<h2>Sign up</h2>\n\n<p>\n    <small>Or sign in with <a href="/auth/facebook">Facebook</a></small><br/>\n    <small>Already have an account? <a ui-sref="login">Login here</a></small>\n</p>\n\n<form novalidate ng-submit="signup()" class="form-horizontal" name="signupForm">\n    <div class="alert alert-warning" ng-if="signupError">{{ signupError }}</div>\n    <div class="form-group">\n        <label for="email" class="col-sm-2">Email (login):</label>\n        <div class="col-sm-10">\n            <input type="email" id="email" name="email" ng-model="user.email" class="form-control" required>\n        </div>\n    </div>\n    <div class="alert alert-warning" ng-if="signupForm.$submitted && signupForm.email.$invalid">Emailaddress is invalid</div>\n\n    <div class="form-group">\n        <label for="firstName" class="col-sm-2">First name:</label>\n        <div class="col-sm-10">\n            <input type="text" id="firstName" name="firstName" ng-model="user.name.first" class="form-control" required>\n        </div>\n    </div>\n    <div class="alert alert-warning" ng-if="signupForm.$submitted && signupForm.firstName.$invalid">First name is required</div>\n    <div class="form-group">\n        <label for="middleName" class="col-sm-2">Middle name:</label>\n        <div class="col-sm-10">\n            <input type="text" id="middleName" name="middleName" ng-model="user.name.middle" class="form-control">\n        </div>\n    </div>\n    <div class="form-group">\n        <label for="lastName" class="col-sm-2">Last name:</label>\n        <div class="col-sm-10">\n            <input type="text" id="lastName" name="lastName" ng-model="user.name.last" class="form-control" required>\n        </div>\n    </div>\n    <div class="alert alert-warning" ng-if="signupForm.$submitted && signupForm.lastName.$invalid">Last name is required</div>\n    <div class="form-group">\n        <label for="password" class="col-sm-2">Password:</label>\n        <div class="col-sm-10">\n            <input type="password" id="password" name="password" ng-model="user.password" class="form-control" required>\n        </div>\n    </div>\n    <div class="alert alert-warning" ng-if="signupForm.$submitted && signupForm.password.$invalid">Password is required</div>\n\n    <div class="form-group">\n        <label for="confirmPassword" class="col-sm-2">Confirm password:</label>\n        <div class="col-sm-10">\n            <input type="password" id="confirmPassword" name="confirmPassword" ng-model="user.confirmPassword" class="form-control" confirm-value="user.password">\n        </div>\n    </div>\n    <div class="alert alert-warning" ng-if="signupForm.$submitted && signupForm.confirmPassword.$invalid">Passwords should match</div>\n\n    <input type="submit" value="Login" >\n</form>'),n.put("views/user.html",'<ol class="breadcrumb">\n    <li><a ui-sref="dashboard">Home</a></li>\n    <li><a ui-sref="users">Users</a></li>\n    <li class="active">{{ user.name.full }}</li>\n</ol>\n\n\n<h1>{{ user.name.full }}</h1>\n\n<form class="form-horizontal" name="editUserForm" ng-submit="user.$update()">\n    <div class="form-group">\n        <label for="first-name" class="col-sm-2">Naam</label>\n        <div class="col-sm-10">\n            <input type="text" ng-model="user.name.first" class="form-control" id="first-name" placeholder="John" required>\n        </div>\n    </div>\n    <div class="form-group">\n        <label for="middle-name" class="col-sm-2">Tussen</label>\n        <div class="col-sm-10">\n            <input type="text" ng-model="user.name.middle" class="form-control" id="middle-name" placeholder="the" size="5">\n        </div>\n    </div>\n    <div class="form-group">\n        <label for="last-name" class="col-sm-2">Achternaam</label>\n        <div class="col-sm-10">\n            <input type="text" ng-model="user.name.last" class="form-control" id="last-name" placeholder="Doe" required>\n        </div>\n    </div>\n    <div class="form-group">\n        <label for="email" class="col-sm-2">Email</label>\n        <div class="col-sm-10">\n            <input type="email" ng-model="user.email" class="form-control" id="email" placeholder="me@hotmail.com" required>\n        </div>\n    </div>\n    <div class="form-group">\n        <label for="password" class="col-sm-2">Wijzig password</label>\n        <div class="col-sm-10">\n            <input type="password" ng-model="user.password" class="form-control" id="password" placeholder="***" >\n        </div>\n    </div>\n    <button type="submit" ng-disabled="editUserForm.$invalid">Save</button>\n</form>\n'),n.put("views/users.html",'<ol class="breadcrumb">\n    <li><a ui-sref="dashboard">Home</a></li>\n    <li class="active">Users</li>\n</ol>\n\n<h1>Users</h1>\n\n<form class="form-inline" ng-submit="addUser(newUser)" name="addUserForm">\n    <div class="form-group">\n        <label for="first-name">Naam</label>\n        <input type="text" ng-model="newUser.name.first" class="form-control" id="first-name" placeholder="John" required>\n    </div>\n    <div class="form-group">\n        <label for="middle-name" class="sr-only">Tussen</label>\n        <input type="text" ng-model="newUser.name.middle" class="form-control" id="middle-name" placeholder="the" size="5">\n    </div>\n    <div class="form-group">\n        <label for="last-name" class="sr-only">Achternaam</label>\n        <input type="text" ng-model="newUser.name.last" class="form-control" id="last-name" placeholder="Doe" required>\n    </div>\n    <div class="form-group">\n        <label for="email">Email</label>\n        <input type="email" ng-model="newUser.email" class="form-control" id="email" placeholder="me@hotmail.com" required>\n    </div>\n    <div class="form-group">\n        <label for="password">Password</label>\n        <input type="password" ng-model="newUser.password" class="form-control" id="password" placeholder="***" required>\n    </div>\n    <button type="submit" ng-disabled="addUserForm.$invalid">Add User</button>\n</form>\n<br/>\n\n<table class="table table-striped table-hover">\n    <tr>\n        <th>Naam</th>\n        <th>Leeftijd</th>\n        <th>Verwijder</th>\n    </tr>\n    <tr ng-repeat="user in users">\n        <td><a ui-sref="user({id: user._id})">{{ user.name.full }}</a></td>\n        <td>{{ user.email }}</td>\n        <td><button ng-click="deleteUser(user)">Delete</button></td>\n    </tr>\n</table>')}]),angular.module("gigPlanner").controller("ApplicationController",["$scope","Account",function(n,e){n.account=e}]),angular.module("gigPlanner").controller("BandController",["$scope","Band",function(n,e){n.bands=e.query(),n.deleteBand=function(e){e.$delete(function(){var a=n.bands.indexOf(e);n.bands.splice(a,1)})},n.addBand=function(a){n.savingBand=!0,e.save(a,function(e){n.newBand={},n.bands.push(e)}).$promise["finally"](function(){n.savingBand=!1})}}]),angular.module("gigPlanner").controller("BandDetailController",["Band","$scope","$stateParams",function(n,e,a){e.band=n.get({id:a.id})}]),angular.module("gigPlanner").controller("DashboardController",["User","$scope",function(n,e){}]),angular.module("gigPlanner").controller("EventController",["$scope","Event",function(n,e){e.query(function(e){n.events=e}),n.deleteEvent=function(e){e.$delete(function(){var a=n.events.indexOf(e);n.events.splice(a,1)})},n.addEvent=function(a){n.savingEvent=!0,e.save(a,function(e){n.newEvent={},n.events.push(e)}).$promise["finally"](function(){n.savingEvent=!1})}}]),angular.module("gigPlanner").controller("EventDetailController",["Event","$scope","$stateParams",function(n,e,a){e.event=n.get({id:a.id})}]),angular.module("gigPlanner").controller("LoginController",["$scope","$state","Account",function(n,e,a){n.user={username:"admin@gigplanner.nl",password:123456},n.login=function(){a.login(n.user).then(function(){e.go("dashboard")})["catch"](function(n){})}}]),angular.module("gigPlanner").controller("SignupController",["$scope","$state","Account",function(n,e,a){n.user={},n.signup=function(){a.signup(n.user).then(function(){e.go("dashboard")})["catch"](function(e){"404"==e.status?n.signupError="Connection lost. Please try again later.":n.signupError=e.data})}}]),angular.module("gigPlanner").controller("UserController",["User","$scope",function(n,e){e.users=n.query(),e.deleteUser=function(n){n.$delete(function(){var a=e.users.indexOf(n);e.users.splice(a,1)})},e.addUser=function(a){e.savingUser=!0,n.save(a,function(n){e.newUser={},e.users.push(n)}).$promise["finally"](function(){e.savingUser=!1})}}]),angular.module("gigPlanner").controller("UserDetailController",["User","$scope","$stateParams",function(n,e,a){e.user=n.get({id:a.id})}]),angular.module("gigPlanner").directive("confirmValue",function(){return{require:"ngModel",scope:{otherModelValue:"=confirmValue"},link:function(n,e,a,l){l.$validators.confirmValue=function(e){return e==n.otherModelValue},n.$watch("otherModelValue",function(){l.$validate()})}}}),angular.module("gigPlanner").service("Account",["$state","$http","api",function(n,e,a){var l=function(n){n&&n.data&&angular.copy(n.data,r.user)},r={user:{},init:function(){return e.get("/auth/currentUser").then(l)},logout:function(){angular.copy({},r.user),a.clearToken(),n.go("login")},login:function(n){return e.post("/auth/login",n).then(l)},isLoggedIn:function(){return!!localStorage.gp_auth_token},signup:function(n){return e.post("/auth/signup",n).then(l)}};return r}]),angular.module("gigPlanner").service("api",["$location",function(n){return{setToken:function(e){e=e||n.search().auth_token,n.search("auth_token",null),e&&(localStorage.gp_auth_token=decodeURI(e))},clearToken:function(){localStorage.gp_auth_token&&localStorage.removeItem("gp_auth_token")}}}]),angular.module("gigPlanner").factory("authInterceptor",["AuthEvents","$rootScope","$q","$location","api",function(n,e,a,l,r){return{request:function(n){return n.headers.Authorization=localStorage.gp_auth_token,n},response:function(n){return r.setToken(n.headers().authorization),n},responseError:function(l){return"401"==l.status&&(e.$broadcast(n.logout),r.clearToken()),a.reject(l)}}}]),angular.module("gigPlanner").factory("Band",["$resource",function(n){return n("/api/band/:id",{id:"@_id"},{update:{method:"PUT"}})}]),angular.module("gigPlanner").factory("Event",["$resource",function(n){return n("/api/event/:id",{id:"@_id"},{update:{method:"PUT"}})}]),angular.module("gigPlanner").factory("User",["$resource",function(n){return n("/api/user/:id",{id:"@_id"},{update:{method:"PUT"}})}]);