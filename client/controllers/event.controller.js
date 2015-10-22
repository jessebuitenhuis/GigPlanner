angular.module('gigPlanner').controller('EventController', function($scope, Event){

    Event.query(function(result){
        $scope.events = result;
    });

    $scope.deleteEvent = function(event){
        event.$delete(function(){
            var index = $scope.events.indexOf(event);
            $scope.events.splice(index, 1);
        });
    };

    $scope.addEvent = function(event) {
        $scope.savingEvent = true;
        Event.save(event, function(result){
            $scope.newEvent = {};
            $scope.events.push(result);
        }).$promise.finally(function(){
                $scope.savingEvent = false;
            });
    };

});