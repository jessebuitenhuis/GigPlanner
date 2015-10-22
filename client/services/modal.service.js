angular.module('gigPlanner').service('Modal', function($uibModal){
    var Modal =  {
        open: function(name, data, options) {
            var modalOptions = {
                templateUrl: 'views/modals/' + name + '.html',
                controller: name + 'ModalController'
            };

            angular.extend(modalOptions, options);

            var modalInstance = $uibModal.open(modalOptions);
            modalInstance.$data = data;

            return modalInstance.result;
        },
        selectUser: function(type, doc) {
            var options = {
                resolve: {
                    "users": function(User) {
                        console.log(type);
                        switch(type) {
                            case 'event':
                                return User.queryLinkedToEvent({event: doc._id}).$promise;
                                break;
                            default:
                                return User.query({}).$promise;
                                break;
                        }
                    }
                }
            };
            return Modal.open('SelectUser', {}, options);
        }
    };
    return Modal;
});
