angular.module('app').config([
	'$locationProvider',
	'$routeProvider',
	function config($locationProvider, $routeProvider, $location, SessionService) {
		$locationProvider.hashPrefix('!');
		$routeProvider.when('/login', {
			template: '<login></login>'
		}).when('/items/add', {
			template: '<item-form></item-form>'
		}).when('/items/edit/:id', {
			template: '<item-form></item-form>'
		}).when('/items/bid/:id', {
			template: '<item-bid></item-bid>'
		}).when('/items', {
			template: '<items-list></items-list>',
			controller: function($location, SessionService) {
				if(!SessionService.isLoggedIn()) {
					$location.path('/login');
				}
			}
		}).when('/logout', {
			template: "",
			controller: function($location, SessionService) {
				SessionService.logout();
				$location.path('/items');
			}
		}).otherwise('/login');
	}]);
