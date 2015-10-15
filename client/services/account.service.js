angular.module('gigPlanner').service('Account', function($state, $http, api){
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
});