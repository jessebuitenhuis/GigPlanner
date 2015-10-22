angular.module('gigPlanner').controller('SelectBandModalController', function(Band, $scope, $modalInstance){

    Band.query(function(result){
        $scope.bands = _.filter(result, function(band){
            return !_.contains($modalInstance.$data.selected, band._id);
        });

    });

    $scope.currentPage = 1;

    $scope.addBand = function(band) {
        Band.save(band, $scope.$close);
    };

});