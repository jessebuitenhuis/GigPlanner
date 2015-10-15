angular.module('gigPlanner').directive('confirmValue', function(){
    return {
        require: 'ngModel',
        scope: {
            otherModelValue: '=confirmValue'
        },
        link: function(scope, element, attrs, ngModel) {
            ngModel.$validators.confirmValue = function(modelValue){
                return modelValue == scope.otherModelValue;
            };

            scope.$watch('otherModelValue', function(){
                ngModel.$validate();
            });
        }
    }
});