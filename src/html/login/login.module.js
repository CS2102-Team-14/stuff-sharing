'use strict';

var baseUrl = '';

angular.module('login', [
	'ngRoute'
]).
service('SessionService', function ($http) {
	var sessionService = {
		'baseUrl': 'http://localhost:8080',
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
					sessionStorage.token = data.token;
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
			return sessionStorage.token !== "undefined";
		},
		'logout': function logout() {
			// TODO: Also invalidate session on server side
			sessionStorage.token = undefined;
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
				data.token = sessionStorage.token;
				this.request(method, path, data, successCallback, errorCallback);
			} else {
				errorCallback("Not logged in");
			}
		}
	};
	return sessionService;
}).
service('AlertsService', function() {
	var alertsService = {
		'alerts': Array(),
		'addAlert': function addAlert(type, msg) {
			this.alerts.push({'type': type, 'msg': msg});
		},
		'getAlerts': function getAlerts() {return this.alerts;},
		'removeAlert': function removeAlert(id) {this.alerts.splice(id, 1);}
	};
	return alertsService;
});
