angular.module('gigPlanner').service('api', function($location){
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
});