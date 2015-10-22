angular.module('gigPlanner').controller('EventDetailController', function(Event, $scope, $stateParams, Modal, $timeout){

    $scope.event = Event.get({id: $stateParams.id});

    $scope.selectUser = function() {
        var selected = $scope.event.users.map(function(user){
            return user.user._id;
        });
        Modal.open('SelectUser', {selected: selected}).then(function(user){
            $scope.event.$addUser({userId: user._id}).catch(function(e){
                $scope.usersError = e.data;
                $timeout(function(){
                    $scope.usersError = null;
                }, 1000);
            });
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