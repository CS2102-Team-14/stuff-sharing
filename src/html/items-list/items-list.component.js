'use strict';

angular.module('itemsList').
component('itemsList', {
	templateUrl: 'items-list/items-list.template.html',
	controller: function ItemsListController($scope, $http, $location, SessionService) {
		function makeColums(array) {
			// Convert array of items into array of arrays
			var numCols = 3;
			var items = Array();
			for(var i = 0; i < array.length / numCols; i++) {
				items.push(array.slice(i * numCols, (i+1) * numCols));
			}
			console.log(array);
			return items;
		}

		// Retrieve user's items
		SessionService.authenticatedRequest(
			'POST',
			'/items',
			{},
			function successCallback(response) {
				var data = response.data;
				$scope.myItems = makeColums(data.items);
				$scope.itemsStats = data.items_stats;
				console.log("My items: ", data.items);
				console.log("My items stats: ", data.items_stats);
			},
			function errorCallback(error) {
				console.log(error);
			}
		);

		// Retrieve all items
		$http.get(SessionService.baseUrl + '/items').
		then(function success(response) {
			var data = response.data;
			if(data.error == false) {
				$scope.allItems = makeColums(data.items);
				console.log('All items: ', $scope.allItems);
			} else {
				console.log("Error retrieving items: " + data.error);
			}
		}, function error() {
			console.log("Request error");
		});

		// Redirect to edit item
		$scope.editItem = function(itemId) {
			$location.path('/items/edit/' + itemId);
		}

		// Retrieve user's bids
		$scope.myBids = {};
		SessionService.authenticatedRequest(
			'POST',
			'/bids',
			{},
			function success(response) {
				console.log('My bids: ', response.data);
				$scope.myBids = response.data.bids;
			},
			function error(error) {
				console.log(error);
			}
		);
	},
}).
directive('holderJs', [function() {
	return {
		link: function($scope, $element, $attrs) {
				$scope.$watch('items', function() {
					$attrs.$set('data-src', $attrs.holderJs);
					Holder.run({images:$element[0], nocss:true});
				});
		}
	};
}]);
