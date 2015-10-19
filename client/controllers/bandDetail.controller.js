angular.module('gigPlanner').controller('BandDetailController', function(Band, $scope, $stateParams, $timeout, $filter, Modal){
    $scope.band = Band.get({id: $stateParams.id});

    $scope.selectUser = function() {
        var selected = $scope.band.members.map(function(member){
            return member.user._id;
        });
        Modal.open('SelectUser', {selected: selected}).then(function(user){
            $scope.band.$addMember({id: $scope.band._id, userId: user._id}).catch(function(e){
                $scope.error = e.data;
                $timeout(function(){
                    $scope.error = null;
                }, 1000);
            });
        });
    };
});