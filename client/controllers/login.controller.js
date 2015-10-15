angular.module('gigPlanner').controller('LoginController', function($scope, $state, Account){
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
});