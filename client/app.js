angular.module('gigPlanner', [
    'ngResource',
    'ui.router',
    'templates',
    'ui.bootstrap'
]);

angular.module('gigPlanner').constant('AuthEvents', {
   "logout": 'auth-logout'
});

angular.module('gigPlanner').config(function($httpProvider, $resourceProvider){
    $httpProvider.interceptors.push('authInterceptor');

    // Add a default PUT method to ngResource
    angular.extend($resourceProvider.defaults.actions, {
        update: { method: 'PUT'}
    });
});

angular.module('gigPlanner').run(function($rootScope, Account, AuthEvents, api, $state){
    api.setToken();
    Account.init();

    $rootScope.$on(AuthEvents.logout, Account.logout);

    $rootScope.$on('$stateChangeStart', function(event, toState){
        if(toState.data && toState.data.auth && !Account.isLoggedIn()) {
            $state.go('login');
            event.preventDefault();
        }
    });

});