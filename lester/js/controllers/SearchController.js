var SearchModule = angular.module("SearchModule", ['ngAnimate', 'AuthModule', 'DataModule', 'VoterDetailModule', 'SliderMenuModule', 'UtilsModule']);
// create the controller and inject Angular's $scope

SearchModule.controller('SearchController', function($scope, AuthFactory, $location, $interval, DataFactory, Utils) {
    if (!AuthFactory.isAuthed()) {
      $location.path(Utils.getBaseHref() + '/');
      return;
    }

    $scope.AllVoters = DataFactory.getVoterJSON()
    $scope.MAX_RESULTS = 20;
    $scope.SearchText = ""
    $scope.Results = []
    $scope.shouldSearch = false;
    $scope.searchWasEmpty = true;
    $scope.SearchPage = true;
    $scope.showOops = false;
    $scope.showResults = false;
    $scope.showDetail = false;

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
        for(var i = 0; i < $scope.AllVoters.length; i++) {
            var FullName = $scope.AllVoters[i].FIRSTNAME + ' ' + $scope.AllVoters[i].LASTNAME;
            var AllNames = FullName.split(' ')
            var Match = false;

            //Check for match.
            for(var j = 0; j < $scope.AllSearches.length; j++) {
                  if ($scope.matchOrNot($scope.AllSearches[j], AllNames)) {
                    Match = true;
                  } else {
                    Match = false;
                    break;
                  }
            }

            if(Match) {
              RESULTS.push($scope.AllVoters[i]);
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

    $scope.voterSelected = function(voterIndex) {
      $scope.voter = $scope.Results[voterIndex];
      $scope.showResults = false;
      $scope.showDetail = true;
      $scope.shouldSearch = false;
      $scope.SearchText = $scope.voter.FIRSTNAME + ' ' + $scope.voter.LASTNAME;
    }

    $interval($scope.search, 1000);
    $scope.load = true;
});
