angular.module('gigPlanner').factory('authInterceptor', function(AuthEvents, $rootScope, $q, $location, api){
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
});