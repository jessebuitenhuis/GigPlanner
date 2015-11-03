angular.module('gigPlanner', [
    'ngResource',
    'ui.router',
    'templates',
    'ui.bootstrap'
]);

angular.module('gigPlanner').constant('AuthEvents', {
   "logout": 'auth-logout'
});

angular.module('gigPlanner').config(["$httpProvider", "$resourceProvider", function($httpProvider, $resourceProvider){
    $httpProvider.interceptors.push('authInterceptor');

    // Add a default PUT method to ngResource
    angular.extend($resourceProvider.defaults.actions, {
        update: { method: 'PUT'}
    });
}]);

angular.module('gigPlanner').run(["$rootScope", "Account", "AuthEvents", "api", "$state", function($rootScope, Account, AuthEvents, api, $state){
    api.setToken();
    Account.init();

    $rootScope.$on(AuthEvents.logout, Account.logout);

    $rootScope.$on('$stateChangeStart', function(event, toState){
        if(toState.data && toState.data.auth && !Account.isLoggedIn()) {
            $state.go('login');
            event.preventDefault();
        }
    });

}]);
angular.module('gigPlanner').config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){

    $urlRouterProvider.otherwise("/dashboard");

    $stateProvider
        .state('dashboard', {
            url: '/dashboard',
            controller: 'DashboardController',
            templateUrl: 'views/dashboard.html'
        })

        // Auth
        .state('login', {
            url: '/login',
            controller: 'LoginController',
            templateUrl: 'views/login.html'
        })
        .state('signup', {
            url: '/signup',
            controller: 'SignupController',
            templateUrl: 'views/signup.html'
        })

        // Users
        .state('users', {
            url: '/users',
            controller: 'UserController',
            templateUrl: 'views/users.html',
            data: { auth: true }
        })
        .state('user', {
            url: '/users/:id',
            controller: 'UserDetailController',
            templateUrl: 'views/user.html',
            data: { auth: true }
        })

        // Bands
        .state('bands', {
            url: '/bands',
            controller: 'BandController',
            templateUrl: 'views/bands.html',
            data: { auth: true }
        })
        .state('band', {
            url: '/bands/:id',
            controller: 'BandDetailController',
            templateUrl: 'views/band.html',
            data: { auth: true }
        })

        // Events
        .state('events', {
            url: '/events',
            controller: 'EventController',
            templateUrl: 'views/events.html',
            data: { auth: true }
        })
        .state('event', {
            url: '/events/:id',
            controller: 'EventDetailController',
            templateUrl: 'views/event.html',
            data: { auth: true }
        });

}]);
angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("views/band.html","<ol class=\"breadcrumb\">\n    <li><a ui-sref=\"dashboard\">Home</a></li>\n    <li><a ui-sref=\"bands\">Bands</a></li>\n    <li class=\"active\">{{ band.name }}</li>\n</ol>\n\n\n<h1>{{ band.name }}</h1>\n\n<form class=\"form-horizontal\" name=\"editBandForm\" ng-submit=\"band.$update()\">\n    <div class=\"form-group\">\n        <label for=\"name\" class=\"col-sm-2\">Naam</label>\n        <div class=\"col-sm-10\">\n            <input type=\"text\" ng-model=\"band.name\" class=\"form-control\" id=\"name\" placeholder=\"Guns n Roses\" required>\n        </div>\n    </div>\n    <button type=\"submit\" ng-disabled=\"editBandForm.$invalid\">Save</button>\n</form>\n\n<h2>Bandmembers</h2>\n<div><button ng-click=\"selectUser()\">Select user</button></div>\n<br/>\n<div class=\"alert alert-warning\" ng-if=\"error\">{{ error }}</div>\n\n<table class=\"table table-striped table-hover\">\n    <tr>\n        <th>Naam</th>\n        <th>Verwijder</th>\n    </tr>\n    <tr ng-repeat=\"member in band.members\">\n        <td><a ui-sref=\"user({id:member.user._id})\">{{ member.user.name.full }}</a></td>\n\n        <td><button ng-click=\"band.$removeMember({id: band._id, memberId: member._id})\">Remove member</button></td>\n    </tr>\n</table>");
$templateCache.put("views/bands.html","<ol class=\"breadcrumb\">\n    <li><a ui-sref=\"dashboard\">Home</a></li>\n    <li class=\"active\">Bands</li>\n</ol>\n\n<h1>Bands</h1>\n\n<form class=\"form-inline\" ng-submit=\"addBand(newBand)\" name=\"addBandForm\">\n    <div class=\"form-group\">\n        <label for=\"name\">Naam</label>\n        <input type=\"text\" ng-model=\"newBand.name\" class=\"form-control\" id=\"name\" placeholder=\"Guns n Roses\" required>\n    </div>\n    <button type=\"submit\" ng-disabled=\"addBandForm.$invalid\">Add Band</button>\n</form>\n<br/>\n\n<table class=\"table table-striped table-hover\">\n    <tr>\n        <th>Naam</th>\n        <th>Verwijder</th>\n    </tr>\n    <tr ng-repeat=\"band in bands\">\n        <td><a ui-sref=\"band({id:band._id})\">{{ band.name }}</a></td>\n\n        <td><button ng-click=\"deleteBand(band)\">Delete</button></td>\n    </tr>\n</table>");
$templateCache.put("views/dashboard.html","<h1>Welkom</h1>\n<p>GigPlanner is een work in progress.</p>");
$templateCache.put("views/event.html","<ol class=\"breadcrumb\">\n    <li><a ui-sref=\"dashboard\">Home</a></li>\n    <li><a ui-sref=\"events\">Events</a></li>\n    <li class=\"active\">{{ event.name }}</li>\n</ol>\n\n<h1>{{ event.name }}</h1>\n\n<form class=\"form-horizontal\" name=\"editEventForm\" ng-submit=\"event.$update()\">\n    <div class=\"form-group\">\n        <label for=\"name\" class=\"col-sm-2\">Naam</label>\n        <div class=\"col-sm-10\">\n            <input type=\"text\" ng-model=\"event.name\" class=\"form-control\" id=\"name\" placeholder=\"Lowlands\" required>\n        </div>\n    </div>\n    <div class=\"form-group\">\n        <label for=\"date\" class=\"col-sm-2\">Datum</label>\n        <div class=\"col-sm-10\">\n            <input type=\"date\" ng-model=\"event.date\" class=\"form-control\" id=\"date\" required>\n        </div>\n    </div>\n    <button type=\"submit\" ng-disabled=\"editEventForm.$invalid\">Save</button>\n</form>\n\n<h2>Users</h2>\n<div><button ng-click=\"selectUser()\">Select user</button></div>\n<br/>\n<div class=\"alert alert-warning\" ng-if=\"errorUsers\">{{ errorUsers }}</div>\n\n<table class=\"table table-striped table-hover\">\n    <tr>\n        <th>Name</th>\n        <th>Delete</th>\n    </tr>\n    <tr ng-repeat=\"user in event.users\">\n        <td><a ui-sref=\"band({id:user.user._id})\">{{ user.name.full }}</a></td>\n\n        <td><button ng-click=\"event.$removeUser({docId: user._id})\">Remove user</button></td>\n    </tr>\n</table>");
$templateCache.put("views/events.html","<ol class=\"breadcrumb\">\n    <li><a ui-sref=\"dashboard\">Home</a></li>\n    <li class=\"active\">Events</li>\n</ol>\n\n<h1>Events</h1>\n\n<form class=\"form-inline\" ng-submit=\"addEvent(newEvent)\" name=\"addEventForm\">\n    <div class=\"form-group\">\n        <label for=\"name\">Naam</label>\n        <input type=\"text\" ng-model=\"newEvent.name\" class=\"form-control\" id=\"name\" placeholder=\"The Big Event\" required>\n    </div>\n    <div class=\"form-group\">\n        <label for=\"date\">Datum</label>\n        <input type=\"date\" ng-model=\"newEvent.date\" class=\"form-control\" id=\"date\" required>\n    </div>\n    <button type=\"submit\" ng-disabled=\"addEventForm.$invalid\">Add Event</button>\n</form>\n<br/>\n\n<table class=\"table table-striped table-hover\">\n    <tr>\n        <th>Naam</th>\n        <th>Datum</th>\n        <th>Verwijder</th>\n    </tr>\n    <tr ng-repeat=\"event in events\">\n        <td><a ui-sref=\"event({id:event._id})\">{{ event.name }}</a></td>\n        <td>{{ event.date | date:\'d MMMM yyyy\' }}</td>\n        <td><button ng-click=\"deleteEvent(event)\">Delete</button></td>\n    </tr>\n</table>");
$templateCache.put("views/login.html","<h2>Login with: </h2>\n<ul>\n    <li><a href=\"http://localhost:8080/auth/facebook\">Facebook</a></li>\n</ul>\n\n<h2>Login locally: </h2>\n\n<form ng-submit=\"login()\" class=\"form-horizontal\" name=\"loginForm\">\n    <div class=\"form-group\">\n        <label for=\"username\" class=\"col-sm-2\">Email:</label>\n        <div class=\"col-sm-10\">\n            <input type=\"email\" id=\"username\" ng-model=\"user.username\" class=\"form-control\">\n        </div>\n    </div>\n    <div class=\"form-group\">\n        <label for=\"password\" class=\"col-sm-2\">Password:</label>\n        <div class=\"col-sm-10\">\n            <input type=\"password\" id=\"password\" ng-model=\"user.password\" class=\"form-control\">\n        </div>\n    </div>\n    <input type=\"submit\" value=\"Login\">\n</form>\n<hr />\n<a ui-sref=\"signup\">Or signup here</a>\n\n");
$templateCache.put("views/signup.html","<h2>Sign up</h2>\n\n<p>\n    <small>Or sign in with <a href=\"/auth/facebook\">Facebook</a></small><br/>\n    <small>Already have an account? <a ui-sref=\"login\">Login here</a></small>\n</p>\n\n<form novalidate ng-submit=\"signup()\" class=\"form-horizontal\" name=\"signupForm\">\n    <div class=\"alert alert-warning\" ng-if=\"signupError\">{{ signupError }}</div>\n    <div class=\"form-group\">\n        <label for=\"email\" class=\"col-sm-2\">Email (login):</label>\n        <div class=\"col-sm-10\">\n            <input type=\"email\" id=\"email\" name=\"email\" ng-model=\"user.email\" class=\"form-control\" required>\n        </div>\n    </div>\n    <div class=\"alert alert-warning\" ng-if=\"signupForm.$submitted && signupForm.email.$invalid\">Emailaddress is invalid</div>\n\n    <div class=\"form-group\">\n        <label for=\"firstName\" class=\"col-sm-2\">First name:</label>\n        <div class=\"col-sm-10\">\n            <input type=\"text\" id=\"firstName\" name=\"firstName\" ng-model=\"user.name.first\" class=\"form-control\" required>\n        </div>\n    </div>\n    <div class=\"alert alert-warning\" ng-if=\"signupForm.$submitted && signupForm.firstName.$invalid\">First name is required</div>\n    <div class=\"form-group\">\n        <label for=\"middleName\" class=\"col-sm-2\">Middle name:</label>\n        <div class=\"col-sm-10\">\n            <input type=\"text\" id=\"middleName\" name=\"middleName\" ng-model=\"user.name.middle\" class=\"form-control\">\n        </div>\n    </div>\n    <div class=\"form-group\">\n        <label for=\"lastName\" class=\"col-sm-2\">Last name:</label>\n        <div class=\"col-sm-10\">\n            <input type=\"text\" id=\"lastName\" name=\"lastName\" ng-model=\"user.name.last\" class=\"form-control\" required>\n        </div>\n    </div>\n    <div class=\"alert alert-warning\" ng-if=\"signupForm.$submitted && signupForm.lastName.$invalid\">Last name is required</div>\n    <div class=\"form-group\">\n        <label for=\"password\" class=\"col-sm-2\">Password:</label>\n        <div class=\"col-sm-10\">\n            <input type=\"password\" id=\"password\" name=\"password\" ng-model=\"user.password\" class=\"form-control\" required>\n        </div>\n    </div>\n    <div class=\"alert alert-warning\" ng-if=\"signupForm.$submitted && signupForm.password.$invalid\">Password is required</div>\n\n    <div class=\"form-group\">\n        <label for=\"confirmPassword\" class=\"col-sm-2\">Confirm password:</label>\n        <div class=\"col-sm-10\">\n            <input type=\"password\" id=\"confirmPassword\" name=\"confirmPassword\" ng-model=\"user.confirmPassword\" class=\"form-control\" confirm-value=\"user.password\">\n        </div>\n    </div>\n    <div class=\"alert alert-warning\" ng-if=\"signupForm.$submitted && signupForm.confirmPassword.$invalid\">Passwords should match</div>\n\n    <input type=\"submit\" value=\"Login\" >\n</form>");
$templateCache.put("views/user.html","<ol class=\"breadcrumb\">\n    <li><a ui-sref=\"dashboard\">Home</a></li>\n    <li><a ui-sref=\"users\">Users</a></li>\n    <li class=\"active\">{{ user.name.full }}</li>\n</ol>\n\n\n<h1>{{ user.name.full }}</h1>\n\n<form class=\"form-horizontal\" name=\"editUserForm\" ng-submit=\"user.$update()\">\n    <div class=\"form-group\">\n        <label for=\"first-name\" class=\"col-sm-2\">Naam</label>\n        <div class=\"col-sm-10\">\n            <input type=\"text\" ng-model=\"user.name.first\" class=\"form-control\" id=\"first-name\" placeholder=\"John\" required>\n        </div>\n    </div>\n    <div class=\"form-group\">\n        <label for=\"middle-name\" class=\"col-sm-2\">Tussen</label>\n        <div class=\"col-sm-10\">\n            <input type=\"text\" ng-model=\"user.name.middle\" class=\"form-control\" id=\"middle-name\" placeholder=\"the\" size=\"5\">\n        </div>\n    </div>\n    <div class=\"form-group\">\n        <label for=\"last-name\" class=\"col-sm-2\">Achternaam</label>\n        <div class=\"col-sm-10\">\n            <input type=\"text\" ng-model=\"user.name.last\" class=\"form-control\" id=\"last-name\" placeholder=\"Doe\" required>\n        </div>\n    </div>\n    <div class=\"form-group\">\n        <label for=\"email\" class=\"col-sm-2\">Email</label>\n        <div class=\"col-sm-10\">\n            <input type=\"email\" ng-model=\"user.email\" class=\"form-control\" id=\"email\" placeholder=\"me@hotmail.com\" required>\n        </div>\n    </div>\n    <div class=\"form-group\">\n        <label for=\"password\" class=\"col-sm-2\">Wijzig password</label>\n        <div class=\"col-sm-10\">\n            <input type=\"password\" ng-model=\"user.password\" class=\"form-control\" id=\"password\" placeholder=\"***\" >\n        </div>\n    </div>\n    <button type=\"submit\" ng-disabled=\"editUserForm.$invalid\">Save</button>\n</form>\n");
$templateCache.put("views/users.html","<ol class=\"breadcrumb\">\n    <li><a ui-sref=\"dashboard\">Home</a></li>\n    <li class=\"active\">Users</li>\n</ol>\n\n<h1>Users</h1>\n\n<form class=\"form-inline\" ng-submit=\"addUser(newUser)\" name=\"addUserForm\">\n    <div class=\"form-group\">\n        <label for=\"first-name\">Naam</label>\n        <input type=\"text\" ng-model=\"newUser.name.first\" class=\"form-control\" id=\"first-name\" placeholder=\"John\" required>\n    </div>\n    <div class=\"form-group\">\n        <label for=\"middle-name\" class=\"sr-only\">Tussen</label>\n        <input type=\"text\" ng-model=\"newUser.name.middle\" class=\"form-control\" id=\"middle-name\" placeholder=\"the\" size=\"5\">\n    </div>\n    <div class=\"form-group\">\n        <label for=\"last-name\" class=\"sr-only\">Achternaam</label>\n        <input type=\"text\" ng-model=\"newUser.name.last\" class=\"form-control\" id=\"last-name\" placeholder=\"Doe\" required>\n    </div>\n    <div class=\"form-group\">\n        <label for=\"email\">Email</label>\n        <input type=\"email\" ng-model=\"newUser.email\" class=\"form-control\" id=\"email\" placeholder=\"me@hotmail.com\" required>\n    </div>\n    <div class=\"form-group\">\n        <label for=\"password\">Password</label>\n        <input type=\"password\" ng-model=\"newUser.password\" class=\"form-control\" id=\"password\" placeholder=\"***\" required>\n    </div>\n    <button type=\"submit\" ng-disabled=\"addUserForm.$invalid\">Add User</button>\n</form>\n<br/>\n\n<table class=\"table table-striped table-hover\">\n    <tr>\n        <th>Naam</th>\n        <th>Leeftijd</th>\n        <th>Verwijder</th>\n    </tr>\n    <tr ng-repeat=\"user in users\">\n        <td><a ui-sref=\"user({id: user._id})\">{{ user.name.full }}</a></td>\n        <td>{{ user.email }}</td>\n        <td><button ng-click=\"deleteUser(user)\">Delete</button></td>\n    </tr>\n</table>");
$templateCache.put("views/modals/SelectBand.html","<h3>Select a user</h3>\n\n<div>\n    <input type=\"text\" id=\"filter\" class=\"form-control\" ng-model=\"filter\" placeholder=\"Search in bands...\">\n</div>\n\n<form class=\"form-inline\" ng-submit=\"addBand(newBand)\" name=\"addBandForm\">\n    <div class=\"form-group\">\n        <label for=\"name\">Naam</label>\n        <input type=\"text\" ng-model=\"newBand.name\" class=\"form-control\" id=\"name\" placeholder=\"Guns n Roses\" required>\n    </div>\n    <button type=\"submit\" ng-disabled=\"addBandForm.$invalid\">Add Band</button>\n</form>\n<br/>\n\n\n<table class=\"table table-striped table-hover\">\n    <tr>\n        <th>Naam</th>\n        <th></th>\n    </tr>\n    <tr ng-repeat=\"band in bands |filter:filter | limitTo:10:((currentPage-1)*10)\">\n        <td>{{ band.name }}</td>\n        <td><button ng-click=\"$close(band)\">Choose</button></td>\n    </tr>\n</table>\n\n<uib-pagination total-items=\"bands.length\" ng-model=\"currentPage\"></uib-pagination>");
$templateCache.put("views/modals/SelectUsers.html","<h3>Select a user</h3>\n\n<div>\n    <input type=\"text\" id=\"filter\" class=\"form-control\" ng-model=\"query\" placeholder=\"Search in users...\">\n</div>\n\n<form class=\"form-inline\" ng-submit=\"addUser(newUser)\" name=\"addUserForm\">\n    <div class=\"form-group\">\n        <label for=\"first-name\">Naam</label>\n        <input type=\"text\" ng-model=\"newUser.name.first\" class=\"form-control\" id=\"first-name\" placeholder=\"John\" required>\n    </div>\n    <div class=\"form-group\">\n        <label for=\"middle-name\" class=\"sr-only\">Tussen</label>\n        <input type=\"text\" ng-model=\"newUser.name.middle\" class=\"form-control\" id=\"middle-name\" placeholder=\"the\" size=\"5\">\n    </div>\n    <div class=\"form-group\">\n        <label for=\"last-name\" class=\"sr-only\">Achternaam</label>\n        <input type=\"text\" ng-model=\"newUser.name.last\" class=\"form-control\" id=\"last-name\" placeholder=\"Doe\" required>\n    </div>\n    <div class=\"form-group\">\n        <label for=\"email\">Email</label>\n        <input type=\"email\" ng-model=\"newUser.email\" class=\"form-control\" id=\"email\" placeholder=\"me@hotmail.com\" required>\n    </div>\n    <div class=\"form-group\">\n        <label for=\"password\">Password</label>\n        <input type=\"password\" ng-model=\"newUser.password\" class=\"form-control\" id=\"password\" placeholder=\"***\" required>\n    </div>\n    <button type=\"submit\" ng-disabled=\"addUserForm.$invalid\">Add User</button>\n</form>\n<br/>\n\n\n<table class=\"table table-striped table-hover\">\n    <tr>\n        <th>Naam</th>\n        <th></th>\n    </tr>\n    <tr ng-repeat=\"user in users | filter:isNotSelected | filter:query | limitTo:10:((currentPage-1)*10)\">\n        <td>{{ user.name.full }}</td>\n        <td><button ng-click=\"$close(user)\">Choose</button></td>\n    </tr>\n</table>\n\n<uib-pagination total-items=\"users.length\" ng-model=\"currentPage\"></uib-pagination>");}]);
angular.module('gigPlanner').controller('ApplicationController', ["$scope", "Account", function($scope, Account){
    $scope.account = Account;
}]);
angular.module('gigPlanner').controller('BandController', ["$scope", "Band", function($scope, Band){

    $scope.bands = Band.query();

    $scope.deleteBand = function(band){
        band.$delete(function(){
            var index = $scope.bands.indexOf(band);
            $scope.bands.splice(index, 1);
        });
    };

    $scope.addBand = function(band) {
        $scope.savingBand = true;
        Band.save(band, function(result){
            $scope.newBand = {};
            $scope.bands.push(result);
        }).$promise.finally(function(){
                $scope.savingBand = false;
            });
    };


}]);
angular.module('gigPlanner').controller('BandDetailController', ["Band", "$scope", "$stateParams", "$timeout", "$filter", "Modal", function(Band, $scope, $stateParams, $timeout, $filter, Modal){
    $scope.band = Band.get({id: $stateParams.id});

    $scope.selectUser = function() {
        Modal.selectUser('band', $scope.band).then(function(user){
            $scope.band.$addMember({id: $scope.band._id, userId: user._id}).catch(function(e){
                $scope.error = e.data;
                $timeout(function(){
                    $scope.error = null;
                }, 1000);
            });
        });
    };
}]);
angular.module('gigPlanner').controller('DashboardController', ["User", "$scope", function(User, $scope){


}]);
angular.module('gigPlanner').controller('EventController', ["$scope", "Event", function($scope, Event){

    Event.query(function(result){
        $scope.events = result;
    });

    $scope.deleteEvent = function(event){
        event.$delete(function(){
            var index = $scope.events.indexOf(event);
            $scope.events.splice(index, 1);
        });
    };

    $scope.addEvent = function(event) {
        $scope.savingEvent = true;
        Event.save(event, function(result){
            $scope.newEvent = {};
            $scope.events.push(result);
        }).$promise.finally(function(){
                $scope.savingEvent = false;
            });
    };

}]);
angular.module('gigPlanner').controller('EventDetailController', ["Event", "User", "$scope", "$stateParams", "Modal", "$timeout", function(Event, User, $scope, $stateParams, Modal, $timeout){

    $scope.event = Event.get({id: $stateParams.id});

    $scope.selectUser = function() {
        Modal.selectUser('event', $scope.event)
            .then(function (user) {
                return $scope.event.$addUser({userId: user._id});
            })
            .catch(function (e) {
                $scope.usersError = e.data;
                $timeout(function () {
                    $scope.usersError = null;
                }, 1000);

        });
    };

}]);
angular.module('gigPlanner').controller('LoginController', ["$scope", "$state", "Account", function($scope, $state, Account){
    $scope.user = {
        username: 'admin@gigplanner.nl',
        password: 123456
    };

    $scope.login = function(){
        Account.login($scope.user).then(function(){
            $state.go('dashboard');
        }).catch(function(error){
            //show error
        });
    };
}]);
angular.module('gigPlanner').controller('SignupController', ["$scope", "$state", "Account", function($scope, $state, Account){

    $scope.user = {};

    $scope.signup = function(){
        Account.signup($scope.user).then(function(){
            $state.go('dashboard');
        }).catch(function(error){
            if (error.status == '404') {
                $scope.signupError = 'Connection lost. Please try again later.';
            } else {
                $scope.signupError = error.data;
            }
        });
    };
}]);
angular.module('gigPlanner').controller('UserController', ["User", "$scope", function(User, $scope){

    $scope.users = User.query();

    $scope.deleteUser = function(user){
        user.$delete(function(){
            var index = $scope.users.indexOf(user);
            $scope.users.splice(index, 1);
        });
    };

    $scope.addUser = function(user) {
        $scope.savingUser = true;
        User.save(user, function(result){
            $scope.newUser = {};
            $scope.users.push(result);
        }).$promise.finally(function(){
              $scope.savingUser = false;
            });
    };


}]);
angular.module('gigPlanner').controller('UserDetailController', ["User", "$scope", "$stateParams", function(User, $scope, $stateParams){

    $scope.user = User.get({id: $stateParams.id});


}]);
angular.module('gigPlanner').directive('confirmValue', function(){
    return {
        require: 'ngModel',
        scope: {
            otherModelValue: '=confirmValue'
        },
        link: function(scope, element, attrs, ngModel) {
            ngModel.$validators.confirmValue = function(modelValue){
                return modelValue == scope.otherModelValue;
            };

            scope.$watch('otherModelValue', function(){
                ngModel.$validate();
            });
        }
    }
});
angular.module('gigPlanner').controller('SelectBandModalController', ["Band", "$scope", "$modalInstance", function(Band, $scope, $modalInstance){

    Band.query(function(result){
        $scope.bands = _.filter(result, function(band){
            return !_.contains($modalInstance.$data.selected, band._id);
        });

    });

    $scope.currentPage = 1;

    $scope.addBand = function(band) {
        Band.save(band, $scope.$close);
    };

}]);
angular.module('gigPlanner').controller('SelectUserModalController', ["User", "$scope", "users", function(User, $scope, users){

    $scope.users = users;

    $scope.currentPage = 1;
    $scope.isNotSelected = function(user){
        return !user.selected;
    };

    $scope.addUser = function(user) {
        User.save(user, $scope.$close);
    };

}]);
angular.module('gigPlanner').service('Account', ["$state", "$http", "api", function($state, $http, api){
    var saveUser = function(result) {
        if (result && result.data) angular.copy(result.data, Account.user);
    };

    var Account = {
        user: {},
        init: function() {
            return $http.get('/auth/currentUser').then(saveUser);
        },
        logout: function(){
            angular.copy({}, Account.user);
            api.clearToken();
            $state.go('login');
        },
        login: function(user){
            return $http.post('/auth/login', user).then(saveUser);
        },
        isLoggedIn: function() {
            return !!localStorage.gp_auth_token;
        },
        signup: function(user) {
            return $http.post('/auth/signup', user).then(saveUser);
        }
    };

    return Account;
}]);
angular.module('gigPlanner').service('api', ["$location", function($location){
    return {
       setToken: function(token){
           token = token || $location.search().auth_token;
           $location.search('auth_token', null);

           if (token) localStorage.gp_auth_token = decodeURI(token);
       },
        clearToken: function() {
            if (localStorage.gp_auth_token) localStorage.removeItem('gp_auth_token');
        }
   };
}]);
angular.module('gigPlanner').factory('authInterceptor', ["AuthEvents", "$rootScope", "$q", "$location", "api", function(AuthEvents, $rootScope, $q, $location, api){
    return {
        'request': function(config) {
            config.headers['Authorization'] = localStorage.gp_auth_token;
            return config;
        },
        'response': function(response) {
            api.setToken(response.headers()['authorization']);
            return response;
        },
        'responseError': function(rejection) {
            if (rejection.status == '401') {
                $rootScope.$broadcast(AuthEvents.logout);
                api.clearToken();
            }
            return $q.reject(rejection);
        }
    };
}]);
angular.module('gigPlanner').factory('Band', ["$resource", function($resource){
    return $resource('/api/bands/:id', {id: '@_id'}, {
        update: {
            method: 'PUT',
            transformRequest: function(data){
                delete data.members;
                return angular.toJson(data);
            }
        },
        addMember: {
            method: 'POST',
            url: '/api/bands/:id/members/:userId',
            params: {userId: '@userId', id: '@id'}
        },
        removeMember: {
            method: 'DELETE',
            url: '/api/bands/:id/members/:memberId',
            params: {memberId: '@memberId', id: '@id'}
        }
    });
}]);
angular.module('gigPlanner').factory('Event', ["$resource", function($resource){
   return $resource('/api/events/:id', {id: '@_id'}, {
        get: {method: 'GET', transformResponse: function(data){
            data = angular.fromJson(data);
            if (data.date) data.date = new Date(data.date);
            return data;
        }},
       update: { method: 'PUT' },
       addUser: { method: 'POST', url: '/api/events/:id/users/:userId' },
       removeUser: { method: 'DELETE', url: '/api/events/:id/users/:docId' },
       addBand: { method: 'POST', url: '/api/events/:id/bands/:bandId' },
       removeBand: { method: 'DELETE', url: '/api/events/:id/bands/:docId' }
   });
}]);
angular.module('gigPlanner').service('Modal', ["$uibModal", function($uibModal){
    var Modal =  {
        open: function(name, data, options) {
            var modalOptions = {
                templateUrl: 'views/modals/' + name + '.html',
                controller: name + 'ModalController'
            };

            angular.extend(modalOptions, options);

            var modalInstance = $uibModal.open(modalOptions);
            modalInstance.$data = data;

            return modalInstance.result;
        },
        selectUser: function(type, doc) {
            var options = {
                resolve: {
                    "users": function(User) {
                        console.log(type);
                        switch(type) {
                            case 'event':
                                return User.queryLinkedToEvent({event: doc._id}).$promise;
                                break;
                            default:
                                return User.query({}).$promise;
                                break;
                        }
                    }
                }
            };
            return Modal.open('SelectUsers', {}, options);
        }
    };
    return Modal;
}]);

angular.module('gigPlanner').factory('User', ["$resource", function($resource){
   return $resource('/api/users/:id', {id: '@_id'}, {
       update: { method: 'PUT'},
       queryLinkedToEvent: { method: 'GET', params: {view: 'linked'}, isArray: true}
   });
}]);