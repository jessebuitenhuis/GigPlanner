angular.module('gigPlanner').controller('EventDetailController', function(Event, $scope, $stateParams){

    $scope.event = Event.get({id: $stateParams.id});


});