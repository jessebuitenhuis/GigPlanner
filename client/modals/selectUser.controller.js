angular.module('gigPlanner').controller('SelectUserModalController', function(User, $scope, users){

    $scope.users = users;

    $scope.currentPage = 1;
    $scope.isNotSelected = function(user){
        return !user.selected;
    };

    $scope.addUser = function(user) {
        User.save(user, $scope.$close);
    };

});