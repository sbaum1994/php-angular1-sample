'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$window', '$http', 'tracerService', function($scope, $window, $http, tracerService) {
  var tracer = tracerService.get();
  $scope.backendRequest = function() {
    var span = tracer.startSpan('view-controller/proxy-request');
    var url = 'http://localhost/api/proxy.php?https://jsonplaceholder.typicode.com/todos/1';
    span.setTag('url', url);
  
    var carrier = {};
    tracer.inject(span.context(), opentracing.FORMAT_TEXT_MAP, carrier);
    $http({
      method: 'GET',
      url: url,
      headers: carrier
    }).then(function successCallback(response) {
      span.setTag('returnStatus', response.status);
      span.setTag('error', false);
      span.finish()
      return 'success';
    }, function errorCallback(response) {
      span.setTag('returnStatus', response.status);
      span.setTag('error', true);
      span.finish();
      return 'failed';
    });
  }
}]);
