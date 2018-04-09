'use strict';

angular.module('itemBid').
component('itemBid', {
	templateUrl: 'item-bid/item-bid.template.html',
	controller: function ItemBidController($scope, $location, $routeParams, $window, SessionService, AlertsService) {
		var id = parseInt($routeParams.id);
		SessionService.request(
			'GET',
			'/items/' + id,
			{},
			function success(response) {
				var data = response.data;
				console.log(response.data);
				if(data.error == false) {
					var item = data.item;
					$scope.item = item;
				} else {
					// TODO: handle error
				}
			},
			function error(error) {
				console.log(error);
			}
		);

		$scope.amount = 0;
		
		$scope.submitBid = function submitBid() {
			var id = parseInt($routeParams.id);
			SessionService.authenticatedRequest(
				'POST',
				'/items/bid/' + id,
				{'amount': $scope.amount},
				function success(response) {
					var error = response.data.error;
					if(error) {
						AlertsService.addAlert('danger', error);
					} else {
						AlertsService.addAlert('success', "Bid successfully created");
						$scope.refreshBids();
					}
				},
				function error(error) {
					console.log(error);
				}
			);
		}

		$scope.bids = {};
		$scope.refreshBids = function refreshBids() {
			var id = parseInt($routeParams.id);
			SessionService.authenticatedRequest(
				'POST',
				'/items/bids/' + id,
				{'amount': $scope.amount},
				function success(response) {
					console.log(response.data);
					$scope.bids = response.data.bids;
				},
				function error(error) {
					console.log(error);
				}
			);
		};

		// Intialize
		$scope.refreshBids();
	}
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
