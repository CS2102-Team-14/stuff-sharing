var navbar = angular.module('navbar', ['ngRoute']);

navbar.component("navbar", {
  templateUrl: 'navbar/navbar.template.html',
  controller: function NavbarController($scope, $location) {
    $scope.location = $location.path();
  }
});
