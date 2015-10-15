angular.module('gigPlanner').factory('User', function($resource){
   return $resource('/api/user/:id', {id: '@_id'}, {
       update: { method: 'PUT'}
   });
});