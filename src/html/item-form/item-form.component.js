'use strict';

angular.module('itemForm').
component('itemForm', {
	templateUrl: 'item-form/item-form.template.html',
	controller: function ItemFormController($scope, $location, $routeParams, $window, SessionService, AlertsService) {
		if($routeParams.id != undefined) {
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
						$scope.item = {
							'id': id,
							'name': item[3],
							'description': item[5],
							'price': item[4],
							'duration': item[6]
						}
					} else {
						// TODO: handle error
					}
				},
				function error(error) {
					console.log(error);
				}
			);
			$scope.showDelete = true;
		} else {
			$scope.item = {
				name: "",
				description: "",
				price: 1,
				duration: 5
			};
			$scope.showDelete = false;
		}

		$scope.submit = function submit() {
			if($routeParams.id != undefined) {
				var id = parseInt($routeParams.id);
				SessionService.authenticatedRequest(
					'PUT',
					'/items/' + id,
					$scope.item,
					function success(response) {
						$location.path('/items');
					},
					function error(error) {
						console.log(error)
					}
				);
			} else {
				SessionService.authenticatedRequest(
					'PUT',
					'/items',
					$scope.item,
					function success(response) {
						AlertsService.addAlert('success', "Item successfully listed");
						$location.path('/items');
					},
					function error(error) {
						console.log(error)
					}
				);
			}
		}

		$scope.deleteItem = function deleteItem() {
			var id = parseInt($routeParams.id);
			if($window.confirm("Are you sure you want to delete this item?")) {
				SessionService.authenticatedRequest(
					'POST',
					'/items/delete/' + id,
					{},
					function success(response) {
						if(response.data.error == false) {
							$location.path('/items');
						} else {
							console.log("Error:", response.data.error);
						}
					},
					function error(error) {
						console.log("Error:", error);
					}
				)
			}
		}
	}
});
