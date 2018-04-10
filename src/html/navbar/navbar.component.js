'use strict';

angular.module('navbar').
component("navbar", {
	templateUrl: 'navbar/navbar.template.html',
	controller: function NavbarController($scope, $location, $http, SessionService) {
		$scope.LocationService = $location;
		$scope.SessionService = SessionService;

		$scope.searchQuery = "";
		$scope.searchItems = Array();
		$scope.search = function search() {
			console.log("Search query: ", $scope.searchQuery);
			SessionService.request('POST',
				'/items/search',
				{'search': $scope.searchQuery},
				function success(response) {
					console.log("Search results: ", response.data.items);
					$scope.searchItems = response.data.items;
				},
				function error(error) {
					console.log("Search error: ", response.data.error);
				}
			);
		};
	}
});
