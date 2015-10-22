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

    $scope.selectBand = function() {
        var selected = $scope.event.bands.map(function(band){
            return band.band._id;
        });
        Modal.open('SelectBand', {selected: selected}).then(function(band){
            $scope.event.$addBand({bandId: band._id}).catch(function(e){
                $scope.bandsError = e.data;
                $timeout(function(){
                    $scope.bandsError = null;
                }, 1000);
            });
        });
    };

});