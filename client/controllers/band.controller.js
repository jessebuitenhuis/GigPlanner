angular.module('gigPlanner').controller('BandController', function($scope, Band){

    $scope.bands = Band.query();

    $scope.deleteBand = function(band){
        band.$delete(function(){
            var index = $scope.bands.indexOf(band);
            $scope.bands.splice(index, 1);
        });
    };

    $scope.addBand = function(band) {
        $scope.savingBand = true;
        Band.save(band, function(result){
            $scope.newBand = {};
            $scope.bands.push(result);
        }).$promise.finally(function(){
                $scope.savingBand = false;
            });
    };


});