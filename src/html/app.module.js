'use strict';

var app = angular.module('app', [
  'ngRoute',
  'login',
  'navbar',
  'itemsList',
  'itemForm',
  'itemBid',
  'ui.bootstrap'
]).controller("AlertsController", function AlertsController($scope, AlertsService) {
	$scope.AlertsService = AlertsService;
})