angular.module('gigPlanner').factory('Band', function($resource){
    return $resource('/api/band/:id', {id: '@_id'}, {
        update: { method: 'PUT'}
    });
});