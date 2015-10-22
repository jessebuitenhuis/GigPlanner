angular.module('gigPlanner').controller('BandDetailController', function(Band, $scope, $stateParams, $timeout, $filter, Modal){
    $scope.band = Band.get({id: $stateParams.id});

    $scope.selectUser = function() {
        Modal.selectUser('band', $scope.band).then(function(user){
            $scope.band.$addMember({id: $scope.band._id, userId: user._id}).catch(function(e){
                $scope.error = e.data;
                $timeout(function(){
                    $scope.error = null;
                }, 1000);
            });
        });
    };
});