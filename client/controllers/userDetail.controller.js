angular.module('gigPlanner').controller('UserDetailController', function(User, $scope, $stateParams){

    $scope.user = User.get({id: $stateParams.id});


});