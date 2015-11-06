angular.module('gigPlanner').controller('BandDetailController', function(Band, Event, $scope, $stateParams, $timeout, Modal){
    $scope.band = Band.get({id: $stateParams.id});
    $scope.events = Event.query({band: $stateParams.id});

    $scope.addEvent = function() {
        $scope.newEvent.band = $scope.band._id;
        Event.save($scope.newEvent, function(event){
            $scope.newEvent = {};
            $scope.events.push(event);
        });
    };
    $scope.removeEvent = function(event) {
        event.$remove(function(){
            var index = $scope.events.indexOf(event);
            $scope.events.splice(index, 1);
        });
    };

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