angular.module('gigPlanner').factory('Event', function($resource){
   return $resource('/api/events/:id', {id: '@_id'}, {
       update: { method: 'PUT'}
   });
});