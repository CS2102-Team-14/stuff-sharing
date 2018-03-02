'use strict';

var loginModule = angular.module('login', ['ngRoute']);

loginModule.service('SessionService', function ($http) {
  var sessionService = {
    'token': null,
    'login': function login(username, password, callback) {
      $http.post(
        'http://localhost:8080/users/authenticate',
        {
          'username': username,
          'password': password
        }
      ).then(function success(response) {
        var data = response.data;
        if(data.error == false) {
          console.log("Authentication token: " + data.token);
          self.token = data.token;
          callback(true, null);
        } else {
          console.log("Authentication failed: " + data.error);
          callback(false, data.error);
        }
      }, function error() {
        console.log("Login request error");
      });
    }
  };
  return sessionService;
});
