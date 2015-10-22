angular.module('gigPlanner').factory('User', function($resource){
   return $resource('/api/users/:id', {id: '@_id'}, {
       update: { method: 'PUT'},
       queryLinkedToEvent: { method: 'GET', params: {view: 'linked'}, isArray: true}
   });
});