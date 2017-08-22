var UtilsModule = angular.module("UtilsModule", ["DataModule", "GeocodeModule", "AuthModule"]);

UtilsModule.factory("Utils", function($http, DataFactory, GeocodeFactory, AuthFactory) {
  var factory = {};

  factory.getBaseHref = function() {
    return lester.hrefBase;
  }

  factory.fixGoogleMapsClick = function(doc) { // DISCLOSURE: THIS IS ONLY HAPPENING BECAUSE MOUSEDOWN/CLICK WILL NOT REGISTER ALONG THE Y AXIS WHERE THESE ELEMENTS ARE.
      //POWERED BY GOOGLE IS EXPLICTLY STATED AT THE BOTTOM OF THE PAGE!!
      doc.find("[style*='z-index: 1000000; position: absolute;']").remove();
      var mapDataElem = doc.find("[style*='z-index: 1000001; position: absolute;']").remove();
      if (angular.element(mapDataElem).hasClass('gmnoprint')) { //Just Making Sure
        mapDataElem.remove();
      }
  }

  factory.prettifyNearbyPage = function(doc) {
      doc.find("[class*='nearbyTopRow']").attr('style', "opacity: .95;");
  }

  /* AHH!
  $scope.VoterGeocodes = [];
  $scope.CSVString = "";

  $scope.mapGeocodes = function() { //Refac
        var start = 13231;
        var printCSV = function() {
            console.log("PARSED " + ($scope.VoterGeocodes.length - start) + " Voter Addresses.")
            console.log("PRINTING CSV")
            for(var i = start; i < $scope.VoterGeocodes.length; i++) {
              $scope.CSVString = $scope.CSVString + $scope.VoterGeocodes[i].VOTERID + "," + $scope.VoterGeocodes[i].LAT + "," + $scope.VoterGeocodes[i].LNG + "\n";
            }
            console.log($scope.CSVString)
        }
        var delay = 10000;
        var geocodedSinceLastFail = 0;
        var getGeocodesDelayed = function(i) {
            if ($scope.endPrint) {
              console.log("GEOCODING END PRINT AT: " + i);
              $interval(printCSV, 5000, 1, false);
              return;
            }
            if (i < $scope.AllVoters.length) {
                var voter = $scope.AllVoters[i];
                var address = voter.ADDR_NUM + ' ' + voter.ADDR_DIR + ' ' + voter.ADDR_STR + ' ' + voter.ADDR_TYPE + ', '
                + voter.ADDR_CITY + ', NY ' + voter.ADDR_ZIP;
                var returnI = false;
                address = address.replace(/\s+/g,' ')
                $scope.GeocodeAddress(address, function(location, status) {
                    if (status == "OK") {
                      $scope.VoterGeocodes[i] = { 'VOTERID': voter.VOTERID, 'LAT': location.lat(), 'LNG': location.lng() };
                      console.log(i + ": Geocode Retrieved (" + $scope.VoterGeocodes[i].VOTERID + "): " + $scope.VoterGeocodes[i].LAT + ", " + $scope.VoterGeocodes[i].LNG);
                      geocodedSinceLastFail++;
                      if (geocodedSinceLastFail > 5) geocodedSinceLastFail = 5;
                      $interval(getGeocodesDelayed, 200, 1, false, (i+1));
                    } else {
                      console.log(i + ":" + voter.VOTERID + ': Geocoding Failed: ' + address + '\n STATUS:' + status)
                      if (status == "OVER_QUERY_LIMIT") {
                        var totalDelay = delay*(18-geocodedSinceLastFail);
                        geocodedSinceLastFail = 0;
                        console.log("GEOCODING WILL CONTINUE IN: " + totalDelay + " MS");
                        $interval(getGeocodesDelayed, totalDelay, 1, false, (i));
                      } else {
                        console.log("GEOCODING STOPPED AT: " + i);
                        $interval(printCSV, 5000, 1, false);
                      }
                    }
                });
            } else {
                console.log("GEOCODING COMPLETED AT: " + i);
                $interval(printCSV, 5000, 1, false);
            }
        }
        console.log("Init Geocoding")
        $interval(getGeocodesDelayed, 500, 1, false, start);
  }

  $scope.stop = false;
  $scope.startMappingGeocodes = function() {
    if ($scope.stop) {
      $scope.endPrint = true;
    } else {
      $scope.mapGeocodes();
      $scope.stop = true;
    }
  }
  */

  return factory;
});
