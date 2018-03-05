'use strict';

var app = angular.module('app', [
  'ngRoute',
  'login',
  'navbar',
  'itemsList'
]);

// Fix for holder.js
app.directive('holderJs', function() {
  return {
    link: function($scope, $element, $attrs) {
      $attrs.$set('data-src', $attrs.holderJs);
      Holder.run({images:$element[0], nocss:true});
    }
  }
});
