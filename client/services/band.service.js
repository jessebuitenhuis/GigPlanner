angular.module('gigPlanner').factory('Band', function($resource){
    return $resource('/api/bands/:id', {id: '@_id'}, {
        update: {
            method: 'PUT',
            transformRequest: function(data){
                delete data.members;
                return angular.toJson(data);
            }
        },
        addMember: {
            method: 'POST',
            url: '/api/bands/:id/members/:userId',
            params: {userId: '@userId', id: '@id'}
        },
        removeMember: {
            method: 'DELETE',
            url: '/api/bands/:id/members/:memberId',
            params: {memberId: '@memberId', id: '@id'}
        }
    });
});