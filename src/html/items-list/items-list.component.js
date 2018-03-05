'use strict';

angular.module('itemsList').
component('itemsList', {
  templateUrl: 'items-list/items-list.template.html',
  controller: function ItemsListController($scope, $http, SessionService) {
    $http.get(SessionService.baseUrl + '/items').
    then(function success(response) {
      var data = response.data;
      if(data.error == false) {
        // Convert array of items into array of arrays
        var numCols = 3;
        var items = Array();
        for(var i = 0; i < data.items.length / numCols; i++) {
          items.push(data.items.slice(i * numCols, (i+1) * numCols));
        }
        $scope.items = items;
        console.log(data);
        console.log(items);
      } else {
        console.log("Error retrieving items: " + data.error);
      }
    }, function error() {
      console.log("Request error");
    });
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
