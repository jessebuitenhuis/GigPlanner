angular.module('gigPlanner').factory('Event', function($resource){
   return $resource('/api/events/:id', {id: '@_id'}, {
       update: { method: 'PUT' },
       addUser: { method: 'POST', url: '/api/events/:id/users/:userId' },
       removeUser: { method: 'DELETE', url: '/api/events/:id/users/:docId' }
   });
});