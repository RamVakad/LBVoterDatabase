var SliderMenuModule = angular.module("SliderMenuModule", ['UtilsModule']);

SliderMenuModule.directive('sliderMenu', function() {
  return {
    restrict: 'E',
    scope: false,
    templateUrl: "partials/SliderMenu.html",
    controller: function($scope, $interval, $location, Utils) {
        $scope.ShowMenu = false;

        $scope.toggleSlideMenu = function() {
          if ($scope.ShowMenu) $scope.ShowMenu = false; else $scope.ShowMenu = true;
        }

        $scope.goToSearch = function() {
          if($location.path() != Utils.getBaseHref() + '/search') {
              $scope.toggleSlideMenu();
              $interval(function() {
                $scope.toggleSlideMenu();
                $location.path(Utils.getBaseHref() + "/search")
              }, 500, 1);
          }
        }

        $scope.goToHousehold = function() {
          if($location.path() != Utils.getBaseHref() + '/household') {
              $scope.toggleSlideMenu();
              $interval(function() {
                $scope.toggleSlideMenu();
                $location.path(Utils.getBaseHref() + "/household")
              }, 500, 1);
          }
        }

        $scope.goToNearby = function() {
          if($location.path() != Utils.getBaseHref() + '/nearby') {
                $scope.toggleSlideMenu();
                $interval(function() {
                  $scope.toggleSlideMenu();
                  $location.path(Utils.getBaseHref() + "/nearby")
                }, 500, 1);
          }
        }
    }
  }
});
