angular.module('gigPlanner').factory('Event', function($resource){
   return $resource('/api/event/:id', {id: '@_id'}, {
       update: { method: 'PUT'}
   });
});