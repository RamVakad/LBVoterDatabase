var HomeModule = angular.module("HomeModule", ['GeocodeModule', 'HouseholdProviderModule', 'DataModule', 'AuthModule', 'UtilsModule', 'PetitionStatusModule']);

HomeModule.controller('HomeController', function($scope, $interval, $location, HouseholdProvider, DataFactory, GeocodeFactory, AuthFactory, Utils, PetStatusManager) {
    $scope.PASSWORD = "";

    $scope.AuthUser = function() {
        $scope.loading = true;
        $interval(function() {
          if (DataFactory.decryptData($scope.PASSWORD)) {
              AuthFactory.setWorkingPassword($scope.PASSWORD);
              PetStatusManager.pullPetitionData();
              DataFactory.parseToJSON();
              GeocodeFactory.getGeocodeData();
              HouseholdProvider.loadHouseholds();
              $location.path(Utils.getBaseHref() + '/search');
          } else {
            $scope.PASSWORD = "";
            alert("Invalid passphrase entered. Please try again.");
          }
          $scope.loading = false;
        }, 0, 1);
    }
});
