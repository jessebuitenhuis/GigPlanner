angular.module('gigPlanner').service('Modal', function($uibModal){
    return {
        open: function(name, data, options) {
            var modalOptions = {
                templateUrl: 'views/modals/' + name + '.html',
                controller: name + 'ModalController'
            };

            angular.extend(modalOptions, options);

            var modalInstance = $uibModal.open(modalOptions);
            modalInstance.$data = data;

            return modalInstance.result;
        }
    }
});
