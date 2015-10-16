angular.module('gigPlanner').factory('User', function($resource){
   return $resource('/api/users/:id', {id: '@_id'}, {
       update: { method: 'PUT'}
   });
});