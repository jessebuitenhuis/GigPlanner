angular.module('gigPlanner').controller('UserController', function(User, $scope){

    User.query(function(result){
        $scope.users = result;
    });

    $scope.deleteUser = function(user){
        user.$delete(function(){
            var index = $scope.users.indexOf(user);
            $scope.users.splice(index, 1);
        });
    };

    $scope.addUser = function(user) {
        $scope.savingUser = true;
        User.save(user, function(result){
            $scope.newUser = {};
            $scope.users.push(result);
        }).$promise.finally(function(){
              $scope.savingUser = false;
            });
    };


});