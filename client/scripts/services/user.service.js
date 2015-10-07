angular.module('gigPlanner').factory('User', function($resource){
   return $resource('/api/user/:userId', {userId: '@_id'}, {
       update: { method: 'PUT'}
   });
});