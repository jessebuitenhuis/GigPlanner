angular.module('gigPlanner').controller('BandDetailController', function(Band, $scope, $stateParams){

    $scope.band = Band.get({id: $stateParams.id});

});