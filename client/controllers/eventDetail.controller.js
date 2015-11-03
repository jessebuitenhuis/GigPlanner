angular.module('gigPlanner').controller('EventDetailController', function(Event, User, $scope, $stateParams, Modal, $timeout){

    $scope.event = Event.get({id: $stateParams.id});

    $scope.selectUser = function() {
        Modal.selectUser('event', $scope.event)
            .then(function (user) {
                return $scope.event.$addUser({userId: user._id});
            })
            .catch(function (e) {
                $scope.usersError = e.data;
                $timeout(function () {
                    $scope.usersError = null;
                }, 1000);

        });
    };

});