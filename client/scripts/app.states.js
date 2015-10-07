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