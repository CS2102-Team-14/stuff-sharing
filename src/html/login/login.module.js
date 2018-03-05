'use strict';

var baseUrl = '';

angular.module('login', [
  'ngRoute'
]).
service('SessionService', function ($http) {
  var sessionService = {
    'baseUrl': 'http://localhost:8080',
    'token': undefined,
    'login': function login(username, password, callback) {
      $http.post(
        this.baseUrl + '/users/authenticate',
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
    },
    'request': function request(method, path, data, successCallback, errorCallback) {
      $http({
        'url': this.baseUrl + path,
        'method': method,
        'data': data,
      })
      .then(successCallback, errorCallback);
    },
    'authenticatedRequest': function authenticatedRequest(method, path, data, successCallback, errorCallback) {
      if(this.isLoggedIn()) {
        data.token = self.token;
        this.request(method, path, data, successCallback, errorCallback);
      } else {
        errorCallback("Not logged in");
      }
    }
  };
  return sessionService;
});
