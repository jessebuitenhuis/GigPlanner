angular.module('gigPlanner').controller('SelectUserModalController', function(User, $scope, $modalInstance){

    User.query(function(result){
        $scope.users = _.filter(result, function(user){
            return !_.contains($modalInstance.$data.selected, user._id);
        });

    });

    $scope.currentPage = 1;

    $scope.addUser = function(user) {
        User.save(user, $scope.$close);
    };

});