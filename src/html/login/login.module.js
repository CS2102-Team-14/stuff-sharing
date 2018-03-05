'use strict';

angular.module('login', [
  'ngRoute'
]).
service('SessionService', function ($http) {
  var sessionService = {
    'token': undefined,
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
          callback(true, undefined);
        } else {
          console.log("Authentication failed: " + data.error);
          callback(false, data.error);
        }
      }, function error() {
        console.log("Login request error");
      });
    },
    'isLoggedIn': function isLoggedIn() {
      return self.token !== undefined;
    },
    'logout': function logout() {
      // TODO: Also invalidate session on server side
      self.token = undefined;
    }
  };
  return sessionService;
});
