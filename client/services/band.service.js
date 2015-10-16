angular.module('gigPlanner').factory('Band', function($resource){
    return $resource('/api/bands/:id', {id: '@_id'}, {
        update: { method: 'PUT'}
    });
});