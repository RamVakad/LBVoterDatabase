var HouseholdModule = angular.module("HouseholdModule", ['ngAnimate', 'HouseholdProviderModule', 'AuthModule', 'DataModule', 'VoterDetailModule', 'SliderMenuModule', 'UtilsModule', 'GeocodeModule']);
//CopyPaste from SearchController.js
HouseholdModule.controller('HouseholdController', function($scope, $location, HouseholdProvider, AuthFactory, $interval, DataFactory, Utils, GeocodeFactory) {
  if (!AuthFactory.isAuthed()) {
    $location.path(Utils.getBaseHref() + '/');
    return;
  }

    $scope.MAX_RESULTS = 20;
    $scope.SearchText = ""
    $scope.Results = []
    $scope.shouldSearch = false;
    $scope.searchWasEmpty = true;
    $scope.HouseholdPage = true;
    $scope.showOops = false;
    $scope.showResults = false;
    $scope.showDetail = false;
    $scope.Households = HouseholdProvider.getHouseholds();

    $scope.searchInputChanged = function() {
        if ($scope.SearchText == "") {
            $scope.shouldSearch = false;
            $scope.Results = [];
            $scope.searchWasEmpty = true;
            $scope.showOops = false;
        } else {
            $scope.shouldSearch = true;
            if ($scope.searchWasEmpty) {
                $scope.searchWasEmpty = false;
                $scope.search();
            }
        }
    }

    $scope.search = function() {
        if (!$scope.shouldSearch) return;
        $scope.shouldSearch = false;
        var searchText = $scope.SearchText.toUpperCase();
        $scope.AllSearches = searchText.split(' ')
        //Start Iterating
        var RESULTS = [];
        for(var i = 0; i < $scope.Households.length; i++) {
            var FullAddr = $scope.Households[i].VOTERS[0].ADDR_NUM + ' ' + $scope.Households[i].VOTERS[0].ADDR_DIR + ' '
                          + $scope.Households[i].VOTERS[0].ADDR_STR + ' ' + $scope.Households[i].VOTERS[0].ADDR_TYPE + ' '
                           + $scope.Households[i].VOTERS[0].ADDR_OTHER + ' ' + $scope.Households[i].VOTERS[0].ADDR_ZIP;
            var AllWords = FullAddr.split(' ')
            var Match = false;

            //Check for match.
            for(var j = 0; j < $scope.AllSearches.length; j++) {
                  if ($scope.matchOrNot($scope.AllSearches[j], AllWords)) {
                    Match = true;
                  } else {
                    Match = false;
                    break;
                  }
            }

            if (Match) {
                RESULTS.push($scope.Households[i]);
                if (RESULTS.length >= $scope.MAX_RESULTS) {
                  break;
                }
            }

        }

        $scope.Results = RESULTS;

        if (RESULTS.length == 0) {
          $scope.showResults = false;
          $scope.showDetail = false;
          $interval(function() { $scope.showOops = true; }, 1000, 1);
        } else {
          $scope.showDetail = false;
          $interval(function() { if (!$scope.showDetail && $scope.Results != 0) $scope.showResults = true; }, 1000, 1);
          $scope.showOops = false;
        }
    }

    $scope.matchOrNot = function(search, words) {
      for(var k = 0; k < words.length; k++) {
        if (words[k].indexOf(search) != -1) return true;
      }
    }

    $scope.householdSelected = function(idx) {
      $scope.Selected = $scope.Results[idx];
      $scope.showDetail = true;
      $scope.shouldSearch = false;
    }

    $scope.voterSelected = function(idx) {
      $scope.Voter = $scope.Selected.VOTERS[idx];
    }

    $scope.backSelection = function() {
        $scope.Voter = null;
    }

    $scope.closeSelection = function() {
        $scope.Selected = null;
        $scope.Voter = null;
        $scope.showResults = true;
        $scope.showDetail = false;
        $scope.shouldSearch = true;
    }

    $interval($scope.search, 1000);
    $scope.load = true;
});
