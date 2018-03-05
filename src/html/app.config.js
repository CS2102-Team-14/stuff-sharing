angular.module('app').config([
  '$locationProvider',
  '$routeProvider',
  function config($locationProvider, $routeProvider, $location, SessionService) {
    $locationProvider.hashPrefix('!');
    $routeProvider.when('/login', {
      template: '<login></login>'
    }).when('/items', {
      template: '<items-list></items-list>'
    }).when('/logout', {
      template: "",
      controller: function($location, SessionService) {
        SessionService.logout();
        $location.path('/items');
      }
    }).otherwise('/login');
  }]);
