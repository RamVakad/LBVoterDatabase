var lester = angular.module('lester', ['ngRoute', 'HomeModule', 'SearchModule', 'NearbyModule', 'HouseholdModule']);

lester.hrefBase = "/lester";

lester.config(function($routeProvider, $locationProvider) {
  $routeProvider.
  when(lester.hrefBase + '/', {
    templateUrl: 'partials/Home.html',
    controller: 'HomeController'
  }).
  when(lester.hrefBase + '/search', {
    templateUrl: 'partials/Search.html',
    controller: 'SearchController'
  }).
  when(lester.hrefBase + '/nearby', {
    templateUrl: 'partials/Nearby.html',
    controller: 'NearbyController'
  }).
  when(lester.hrefBase + '/household', {
    templateUrl: 'partials/Household.html',
    controller: 'HouseholdController'
  }).
  otherwise({
      redirectTo: lester.hrefBase + '/'
    });
});
