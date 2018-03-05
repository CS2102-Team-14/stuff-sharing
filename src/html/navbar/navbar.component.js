'use strict';

angular.module('navbar').
component("navbar", {
  templateUrl: 'navbar/navbar.template.html',
  controller: function NavbarController($scope, $location, SessionService) {
    $scope.location = $location.path();
    $scope.SessionService = SessionService;
  }
});
