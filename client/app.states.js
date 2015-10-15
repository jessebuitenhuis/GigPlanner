angular.module('gigPlanner').config(function($stateProvider, $urlRouterProvider){

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

});