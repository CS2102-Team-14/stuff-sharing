'use strict';

angular.module('login').
component('login', {
  templateUrl: 'login/login.template.html',
  controller: function LoginController($scope, $element, $attrs, $http, SessionService) {
    var ctrl = this;

    $scope.formData = {
      'username': '',
      'password': ''
    };
    $scope.showMessage = false;
    $scope.message = "";

    ctrl.loginCallback = function(success, error) {
      if(success) {
        console.log("Authentication successful");
      } else {
        ctrl.showMessage = true;
        ctrl.message = error;
      }
    };

    ctrl.login = function(formData) {
      SessionService.login(formData.username, formData.password, ctrl.loginCallback);
    };
  }
});
