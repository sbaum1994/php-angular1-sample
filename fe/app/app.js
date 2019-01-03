'use strict';

angular.module('tracerService', [])
.service('tracerService', ['$window', function($window) {
  var lightstep = $window.lightstep;
  var opentracing = $window.opentracing;
  var tracer = new lightstep.Tracer({
    access_token: '{ACCESS_TOKEN_HERE}',
    component_name: 'my-app',
    platform: 'browser',
    verbosity: 4
  });
  opentracing.initGlobalTracer(tracer);

  if (!!$window.tracerService) {
    return $window.tracerService
  }

  $window.tracerService = {
    get: function() {
      return tracer;
    }
  }

  return $window.tracerService;
}]);

// Declare app level module which depends on views, and core components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'tracerService'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}]);

var appBody = document.getElementsByTagName('body')[0];

angular.bootstrap(appBody, ['tracerService']);
