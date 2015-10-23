angular.module('gigPlanner').factory('Event', function($resource){
   return $resource('/api/events/:id', {id: '@_id'}, {
        get: {method: 'GET', transformResponse: function(data){
            data = angular.fromJson(data);
            if (data.date) data.date = new Date(data.date);
            return data;
        }},
       update: { method: 'PUT' },
       addUser: { method: 'POST', url: '/api/events/:id/users/:userId' },
       removeUser: { method: 'DELETE', url: '/api/events/:id/users/:docId' },
       addBand: { method: 'POST', url: '/api/events/:id/bands/:bandId' },
       removeBand: { method: 'DELETE', url: '/api/events/:id/bands/:docId' }
   });
});