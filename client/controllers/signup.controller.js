angular.module('gigPlanner').controller('SignupController', function($scope, $state, Account){

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
});