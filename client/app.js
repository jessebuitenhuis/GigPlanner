angular.module('gigPlanner', [
    'ngResource',
    'ui.router',
    'templates'
]);

angular.module('gigPlanner').constant('AuthEvents', {
   "logout": 'auth-logout'
});

angular.module('gigPlanner').config(function($httpProvider){
    $httpProvider.interceptors.push('authInterceptor');
});

angular.module('gigPlanner').run(function($rootScope, Account, AuthEvents, api, $state){
    api.setToken();
    Account.init();

    $rootScope.$on(AuthEvents.logout, Account.logout);

    $rootScope.$on('$stateChangeStart', function(event, toState){
        if(toState.data && toState.data.auth) {
            if (!Account.isLoggedIn()) {
                event.preventDefault();
                $state.go('login');
            }
        }
    });

});