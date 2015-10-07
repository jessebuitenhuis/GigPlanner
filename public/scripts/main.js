angular.module('gigPlanner', [
    'ngResource',
    'ui.router'
]);
angular.module('gigPlanner').config(function($stateProvider, $urlRouterProvider){

    $urlRouterProvider.otherwise("/dashboard");

    $stateProvider
        .state('dashboard', {
            url: '/dashboard',
            controller: 'DashboardController',
            templateUrl: 'dashboard.html'
        })

        .state('users', {
            url: '/users',
            controller: 'UserController',
            templateUrl: 'users.html'
        })

        .state('bands', {
            url: '/bands',
            controller: 'BandController',
            templateUrl: 'bands.html'
        })

        .state('events', {
            url: '/events',
            controller: 'EventController',
            templateUrl: 'events.html'
        });


});
angular.module('gigPlanner').controller('DashboardController', function(User, $scope){


});
angular.module('gigPlanner').controller('BandController', function(){




});
angular.module('gigPlanner').controller('EventController', function(){




});
angular.module('gigPlanner').controller('UserController', function(User, $scope){

    User.query(function(result){
        $scope.users = result;
    });

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


});
angular.module('gigPlanner').factory('User', function($resource){
   return $resource('/api/user/:userId', {userId: '@_id'}, {
       update: { method: 'PUT'}
   });
});